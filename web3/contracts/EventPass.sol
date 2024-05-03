// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EventPass is Ownable, ReentrancyGuard, ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _totalEvents;
    Counters.Counter private _totalTickets;
    Counters.Counter private _totalTokens;

    struct EventStruct {
        uint256 id;
        string title;
        string imageUrl;
        string description;
        address owner;
        uint256 ticketCost;
        uint256 ticketAmount;
        uint256 ticketRemain;
        uint256 startsAt;
        uint256 endsAt;
        string location;
        uint256 timestamp;
        string category;
        bool deleted;
        bool paidOut;
        bool refunded;
        uint256 balance;
    }

    struct TicketStruct {
        uint256 id;
        uint256 eventId;
        uint256 tokenId;
        address owner;
        uint256 ticketCost;
        uint256 timestamp;
        string qrCode;
        bool verified;
        bool reselled;
        bool isWaitingForRefund;
        bool refunded;
        bool minted;
    }

    uint256 private constant TOTAL_TICKETS_CAN_PURCHASE = 5;

    mapping(uint256 => EventStruct) private events;
    mapping(uint256 => TicketStruct[]) private tickets;
    mapping(uint256 => mapping(uint256 => address[])) private ticketHistory;
    mapping(uint256 => bool) private eventExists;

    event EventCreated(
        uint256 eventId,
        string title,
        address owner,
        uint256 ticketCost,
        uint256 ticketAmount
    );
    event TicketsPurchased(
        uint256 eventId,
        address buyer,
        uint256 numOfTickets
    );

    constructor() ERC721("EventPass", "EP") {}

    /**
     * @dev Creates a new event with the specified details.
     * @param title The title of the event.
     * @param description The description of the event.
     * @param imageUrl The URL of the image associated with the event.
     * @param ticketAmount The total number of tickets available for the event.
     * @param ticketCost The cost of each ticket for the event.
     * @param startsAt The starting timestamp of the event.
     * @param endsAt The ending timestamp of the event.
     * @param location The location where the event will take place.
     * @param category The category of the event.
     */
    function createEvent(
        string memory title,
        string memory description,
        string memory imageUrl,
        uint256 ticketAmount,
        uint256 ticketCost,
        uint256 startsAt,
        uint256 endsAt,
        string memory location,
        string memory category
    ) public {
        require(ticketCost > 0 ether, "TicketCost must be greater than zero");
        require(ticketAmount > 0, "TicketAmount must be greater than zero");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(imageUrl).length > 0, "ImageUrl cannot be empty");
        require(startsAt > 0, "Start date must be greater than zero");
        require(endsAt > startsAt, "End date must be greater than start date");
        require(bytes(location).length > 0, "Location cannot be empty");
        require(bytes(category).length > 0, "Category cannot be empty");

        _totalEvents.increment();
        EventStruct memory newEvent;

        newEvent.id = _totalEvents.current();
        newEvent.title = title;
        newEvent.description = description;
        newEvent.imageUrl = imageUrl;
        newEvent.ticketAmount = ticketAmount;
        newEvent.ticketRemain = ticketAmount;
        newEvent.ticketCost = ticketCost;
        newEvent.startsAt = startsAt;
        newEvent.endsAt = endsAt;
        newEvent.owner = msg.sender;
        newEvent.timestamp = currentTime();
        newEvent.location = location;
        newEvent.category = category;

        eventExists[newEvent.id] = true;
        events[newEvent.id] = newEvent;

        emit EventCreated(
            newEvent.id,
            title,
            msg.sender,
            ticketCost,
            ticketAmount
        );
    }

    /**
     * @dev Update the details of an existing event
     * @param eventId The ID of the event to be updated
     * @param title The new title of the event
     * @param description The new description of the event
     * @param imageUrl The new image URL of the event
     * @param ticketAmount The new total ticket amount for the event
     * @param ticketRemain The updated remaining ticket amount for the event
     * @param ticketCost The new cost of each ticket for the event
     * @param startsAt The new start timestamp of the event
     * @param endsAt The new end timestamp of the event
     * @param location The new location of the event
     * @param category The new category of the event
     */
    function updateEvent(
        uint256 eventId,
        string memory title,
        string memory description,
        string memory imageUrl,
        uint256 ticketAmount,
        uint256 ticketRemain,
        uint256 ticketCost,
        uint256 startsAt,
        uint256 endsAt,
        string memory location,
        string memory category
    ) public {
        require(eventExists[eventId], "Event not found");
        require(events[eventId].owner == msg.sender, "Unauthorized entity");
        require(ticketCost > 0 ether, "TicketCost must be greater than zero");
        require(ticketAmount > 0, "TicketAmount must be greater than zero");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(imageUrl).length > 0, "ImageUrl cannot be empty");
        require(startsAt > 0, "Start date must be greater than zero");
        require(endsAt > startsAt, "End date must be greater than start date");
        require(bytes(location).length > 0, "Location cannot be empty");
        require(bytes(category).length > 0, "Category cannot be empty");

        events[eventId].title = title;
        events[eventId].description = description;
        events[eventId].imageUrl = imageUrl;
        events[eventId].ticketAmount = ticketAmount;
        events[eventId].ticketRemain = ticketRemain;
        events[eventId].ticketCost = ticketCost;
        events[eventId].startsAt = startsAt;
        events[eventId].endsAt = endsAt;
        events[eventId].location = location;
        events[eventId].category = category;
    }

    /**
     * @dev Deletes an event and optionally refunds the tickets.
     * @param eventId The ID of the event to delete.
     * @param isRefunded Flag to indicate if the tickets should be refunded.
     */
    function deleteEvent(uint256 eventId, bool isRefunded) public {
        require(eventExists[eventId], "Event not found");
        require(
            events[eventId].owner == msg.sender || msg.sender == owner(),
            "Unauthorized entity"
        );
        require(!events[eventId].deleted, "Event already deleted");

        if (isRefunded == true) {
            events[eventId].deleted = true;
            refundTickets(eventId);
        } else {
            events[eventId].deleted = true;
        }
    }

    /**
     * @dev Get all events in the contract.
     * @return Events An array of EventStruct containing all available events.
     */
    function getAllEvents() public view returns (EventStruct[] memory Events) {
        uint256 available = 0;
        for (uint256 i = 1; i <= _totalEvents.current(); i++) {
            if (!events[i].deleted) {
                available++;
            }
        }

        Events = new EventStruct[](available);
        uint256 index = 0;
        for (uint256 i = 1; i <= _totalEvents.current(); i++) {
            if (!events[i].deleted) {
                Events[index++] = events[i];
            }
        }
    }

    /**
     * @dev Gets all events created by a specific address.
     * @param myAddress The address of the user.
     * @return Events An array of EventStruct objects representing the events created by the user.
     */
    function getMyEvents(
        address myAddress
    ) public view returns (EventStruct[] memory Events) {
        uint256 available = 0;
        for (uint256 i = 1; i <= _totalEvents.current(); i++) {
            if (!events[i].deleted && events[i].owner == myAddress) {
                available++;
            }
        }
        Events = new EventStruct[](available);
        uint256 index = 0;
        for (uint256 i = 1; i <= _totalEvents.current(); i++) {
            if (!events[i].deleted && events[i].owner == myAddress) {
                Events[index++] = events[i];
            }
        }
    }

    /**
     * @dev Get details of a single event by eventId
     * @param eventId The id of the event to fetch details for
     * @return EventStruct Details of the event
     */
    function getSingleEvent(
        uint256 eventId
    ) public view returns (EventStruct memory) {
        return events[eventId];
    }

    /**
     * @dev Allows a user to purchase tickets for a specific event.
     * @param eventId The ID of the event for which tickets are being purchased.
     * @param numOfTicket The number of tickets to purchase.
     * @param baseUrl The base URL for generating the QR code for the ticket.
     * Requirements:
     * - The event must exist.
     * - The user cannot be the owner of the event.
     * - The user must send sufficient Ether to cover the cost of the tickets.
     * - The event must have enough tickets remaining.
     * - The user must not exceed the total number of tickets they can purchase.
     * Effects:
     * - Creates ticket objects for the user and deducts the ticket cost from their balance.
     * - Updates the ticket remaining count for the event.
     */
    function buyTickets(
        uint256 eventId,
        uint256 numOfTicket,
        string memory baseUrl
    ) public payable {
        require(eventExists[eventId], "Event not found");
        require(
            events[eventId].owner != msg.sender,
            "You can't purchase a ticket"
        );
        require(
            msg.value >= events[eventId].ticketCost * numOfTicket,
            "Insufficient amount"
        );
        require(numOfTicket <= events[eventId].ticketRemain, "Out of tickets");

        uint256 userBoughtTickets = getNumberOfTicketUserByFromEvent(
            eventId,
            msg.sender
        );
        require(
            userBoughtTickets <= TOTAL_TICKETS_CAN_PURCHASE,
            "Ticket purchase limit reached"
        );
        require(
            userBoughtTickets + numOfTicket <= TOTAL_TICKETS_CAN_PURCHASE,
            "You cannot purchase this amount of tickets"
        );

        if (
            userBoughtTickets <= TOTAL_TICKETS_CAN_PURCHASE &&
            (userBoughtTickets + numOfTicket) <= TOTAL_TICKETS_CAN_PURCHASE
        ) {
            for (uint i = 0; i < numOfTicket; i++) {
                uint256 currentTicketId = _totalTickets.current();

                TicketStruct memory ticket;

                ticket.id = currentTicketId;
                ticket.eventId = eventId;
                ticket.owner = msg.sender;
                ticket.ticketCost = events[eventId].ticketCost;
                ticket.timestamp = currentTime();
                ticket.qrCode = string(
                    abi.encodePacked(
                        baseUrl,
                        "/ticket-info/",
                        Strings.toHexString(uint256(uint160(msg.sender)), 20),
                        "/",
                        Strings.toString(eventId),
                        "/",
                        Strings.toString(currentTicketId)
                    )
                );

                // mint ticket
                _totalTokens.increment();
                _mint(msg.sender, _totalTokens.current());
                ticket.minted = true;
                ticket.tokenId = _totalTokens.current();

                tickets[eventId].push(ticket);
                ticketHistory[eventId][currentTicketId].push(
                    events[eventId].owner
                );
                ticketHistory[eventId][currentTicketId].push(msg.sender);
                _totalTickets.increment();
            }

            events[eventId].ticketRemain -= numOfTicket;
            events[eventId].balance = events[eventId].balance += msg.value;

            emit TicketsPurchased(eventId, msg.sender, numOfTicket);
        }
    }

    /**
     * @dev Get all tickets for a specific event.
     * @param eventId The ID of the event to get tickets for.
     * @return Tickets An array of TicketStruct containing all tickets for the specified event.
     */
    function getAllTicketsByEvent(
        uint256 eventId
    ) public view returns (TicketStruct[] memory Tickets) {
        return tickets[eventId];
    }

    /**
     * @dev Retrieves information about a single ticket for a specific event.
     * @param eventId The unique identifier of the event.
     * @param ticketId The unique identifier of the ticket.
     * @return TicketStruct The details of the ticket.
     */
    function getSingleTicket(
        uint256 eventId,
        uint256 ticketId
    ) public view returns (TicketStruct memory) {
        for (uint256 i = 0; i < tickets[eventId].length; i++) {
            if (
                !tickets[eventId][i].refunded &&
                tickets[eventId][i].id == ticketId
            ) {
                return tickets[eventId][i];
            }
        }
        return
            TicketStruct(
                0,
                0,
                0,
                address(0),
                0,
                0,
                "",
                false,
                false,
                false,
                false,
                false
            );
    }

    /**
     * @dev Get all the tickets owned by a specific address
     * @param myAddress The address of the owner of the tickets
     * @return Tickets An array of TicketStruct representing the tickets owned by the address
     */
    function getMyTickets(
        address myAddress
    ) public view returns (TicketStruct[] memory Tickets) {
        uint256 available = 0;
        for (uint256 i = 1; i <= _totalTickets.current(); i++) {
            for (uint256 j = 0; j < tickets[i].length; j++) {
                if (
                    !tickets[i][j].refunded && tickets[i][j].owner == myAddress
                ) {
                    available++;
                }
            }
        }
        Tickets = new TicketStruct[](available);
        uint256 index = 0;
        for (uint256 i = 1; i <= _totalTickets.current(); i++) {
            for (uint256 j = 0; j < tickets[i].length; j++) {
                if (
                    !tickets[i][j].refunded && tickets[i][j].owner == myAddress
                ) {
                    Tickets[index++] = tickets[i][j];
                }
            }
        }
    }

    /**
     * @dev Allows a user to request a refund for a specific ticket for an event.
     * @param eventId The ID of the event for which the ticket was purchased.
     * @param ticketId The ID of the ticket for which a refund is being requested.
     */
    function requestRefundTicket(uint256 eventId, uint256 ticketId) public {
        require(
            currentTime() < events[eventId].startsAt,
            "Event has already occurred"
        );
        for (uint256 i = 0; i < tickets[eventId].length; i++) {
            if (
                !tickets[eventId][i].refunded &&
                tickets[eventId][i].id == ticketId
            ) {
                tickets[eventId][i].isWaitingForRefund = true;
                break;
            }
        }
    }

    /**
     * @dev Cancels the refund request for a specific ticket in an event.
     * @param eventId The ID of the event.
     * @param ticketId The ID of the ticket to cancel the refund request for.
     */
    function cancelRefundTicket(uint256 eventId, uint256 ticketId) public {
        for (uint256 i = 0; i < tickets[eventId].length; i++) {
            if (
                !tickets[eventId][i].refunded &&
                tickets[eventId][i].id == ticketId
            ) {
                tickets[eventId][i].isWaitingForRefund = false;
                break;
            }
        }
    }

    /**
     * @dev Refunds a specific ticket to the owner of the ticket
     * @param eventId The ID of the event to which the ticket belongs
     * @param ticketId The ID of the ticket to be refunded
     */
    function refundTicket(uint256 eventId, uint256 ticketId) public {
        require(eventExists[eventId], "Event not found");
        require(
            events[eventId].owner == msg.sender || msg.sender == owner(),
            "Unauthorized entity"
        );
        require(!events[eventId].deleted, "Event already deleted");

        for (uint256 i = 0; i < tickets[eventId].length; i++) {
            if (tickets[eventId][i].id == ticketId) {
                tickets[eventId][i].refunded = true;
                tickets[eventId][i].isWaitingForRefund = false;

                events[eventId].balance = events[eventId].balance -= tickets[
                    eventId
                ][i].ticketCost;
                payTo(
                    tickets[eventId][i].owner,
                    tickets[eventId][i].ticketCost
                );

                break;
            }
        }
    }

    /**
     * @dev Refund all tickets for a specific event
     * @param eventId The ID of the event to refund tickets for
     * @return true if all tickets were successfully refunded
     */
    function refundTickets(uint256 eventId) internal returns (bool) {
        for (uint i = 0; i < tickets[eventId].length; i++) {
            tickets[eventId][i].refunded = true;
            tickets[eventId][i].isWaitingForRefund = false;
            events[eventId].balance = events[eventId].balance -= tickets[
                eventId
            ][i].ticketCost;
        }
        events[eventId].refunded = true;
        for (uint i = 0; i < tickets[eventId].length; i++) {
            payTo(tickets[eventId][i].owner, tickets[eventId][i].ticketCost);
        }
        return true;
    }

    /**
     * @dev Allows a user to resell a ticket for an event
     * @param eventId The ID of the event for which the ticket is being resold
     * @param ticketId The ID of the ticket that is being resold
     * @param myAddress The address of the user reselling the ticket
     */
    function resellTicket(
        uint256 eventId,
        uint256 ticketId,
        address myAddress
    ) public {
        require(
            currentTime() < events[eventId].startsAt,
            "Event has already occurred"
        );
        for (uint256 i = 0; i < tickets[eventId].length; i++) {
            if (
                !tickets[eventId][i].verified &&
                tickets[eventId][i].id == ticketId &&
                tickets[eventId][i].owner == myAddress
            ) {
                tickets[eventId][i].reselled = true;
                break;
            }
        }
    }

    /**
     * @dev Cancel the ticket resell status for a specific ticket.
     * @param eventId The ID of the event where the ticket belongs.
     * @param ticketId The ID of the ticket to cancel the resell status for.
     * @param myAddress The address of the current ticket owner.
     */
    function getBackResellTicket(
        uint256 eventId,
        uint256 ticketId,
        address myAddress
    ) public {
        for (uint256 i = 0; i < tickets[eventId].length; i++) {
            if (
                !tickets[eventId][i].verified &&
                tickets[eventId][i].id == ticketId &&
                tickets[eventId][i].owner == myAddress
            ) {
                tickets[eventId][i].reselled = false;
                break;
            }
        }
    }

    /**
     * @dev Get all resold tickets for a specific event
     * @param eventId The ID of the event
     * @return Tickets An array of TicketStruct representing the resold tickets for the event
     */
    function getResellTicketsByEventId(
        uint256 eventId
    ) public view returns (TicketStruct[] memory Tickets) {
        uint256 available = 0;
        for (uint256 i = 0; i < tickets[eventId].length; i++) {
            if (tickets[eventId][i].reselled) {
                available++;
            }
        }

        Tickets = new TicketStruct[](available);
        uint256 index = 0;
        for (uint256 i = 0; i < tickets[eventId].length; i++) {
            if (tickets[eventId][i].reselled) {
                Tickets[index++] = tickets[eventId][i];
            }
        }
    }

    /**
     * @dev Allows a user to buy a resold ticket for a specific event.
     * @param eventId The ID of the event for which the ticket is being purchased.
     * @param ticketId The ID of the ticket being purchased.
     * @param newOwner The address of the new owner of the ticket.
     * @param baseUrl The base URL used to generate the QR code for the ticket.
     * @param tokenId The token ID of the ticket being purchased.
     * @notice Requires that the event exists, the user has provided enough funds, and the event has not yet occurred.
     * @notice Checks the ticket purchase limit for the user.
     * @notice Cancels the resale of the ticket once purchased.
     * @dev Updates the ticket owner, generates a new QR code, and transfers ownership of the ticket token.
     * @dev Pays the ticket cost to the new owner.
     */
    function buyReselledTicket(
        uint256 eventId,
        uint256 ticketId,
        address newOwner,
        string memory baseUrl,
        uint256 tokenId
    ) public payable {
        require(eventExists[eventId], "Event not found");
        require(msg.value >= events[eventId].ticketCost, "Insufficient amount");
        require(
            currentTime() < events[eventId].startsAt,
            "Event has already occurred"
        );
        uint256 userBoughtTickets = getNumberOfTicketUserByFromEvent(
            eventId,
            newOwner
        );

        require(
            userBoughtTickets <= TOTAL_TICKETS_CAN_PURCHASE,
            "Ticket purchase limit reached"
        );
        require(
            userBoughtTickets + 1 <= TOTAL_TICKETS_CAN_PURCHASE,
            "You cannot purchase this amount of tickets"
        );

        for (uint256 i = 0; i < tickets[eventId].length; i++) {
            if (
                tickets[eventId][i].id == ticketId &&
                tickets[eventId][i].owner != newOwner
            ) {
                tickets[eventId][i].owner = newOwner;
                tickets[eventId][i].qrCode = string(
                    abi.encodePacked(
                        baseUrl,
                        "/ticket-info/",
                        Strings.toHexString(uint256(uint160(msg.sender)), 20),
                        "/",
                        Strings.toString(eventId),
                        "/",
                        Strings.toString(tickets[eventId][i].id)
                    )
                );
                tickets[eventId][i].reselled = false;
                ticketHistory[eventId][i].push(newOwner);

                payTo(
                    tickets[eventId][i].owner,
                    tickets[eventId][i].ticketCost
                );
                // Transfer ownership of the ticket token
                _transfer(tickets[eventId][i].owner, newOwner, tokenId);

                emit TicketsPurchased(eventId, msg.sender, 1);
                break;
            }
        }
    }

    /**
     * @dev Returns the number of tickets owned by a specific user for a given event.
     * @param eventId The ID of the event.
     * @param myAddress The address of the user.
     * @return The number of tickets owned by the user for the event.
     */
    function getNumberOfTicketUserByFromEvent(
        uint256 eventId,
        address myAddress
    ) internal view returns (uint256) {
        uint available = 0;
        for (uint i = 0; i < tickets[eventId].length; i++) {
            if (tickets[eventId][i].owner == myAddress) {
                available++;
            }
        }
        return available;
    }

    /**
     * @dev Verifies a ticket for a specific event.
     * @param myAddress The address of the user verifying the ticket.
     * @param ticketId The ID of the ticket to be verified.
     * @param eventId The ID of the event related to the ticket.
     */
    function verifyTicket(
        address myAddress,
        uint256 ticketId,
        uint256 eventId
    ) public {
        require(eventExists[eventId], "Event does not exist");

        for (uint256 i = 0; i < tickets[eventId].length; i++) {
            if (
                tickets[eventId][i].id == ticketId &&
                tickets[eventId][i].owner == myAddress
            ) {
                tickets[eventId][i].verified = true;
                break;
            }
        }
    }

    /**
     * @notice Check the verification status of a ticket for a specific address in an event
     * @param myAddress The address of the ticket owner
     * @param ticketId The ID of the ticket to check
     * @param eventId The ID of the event associated with the ticket
     * @return status The verification status of the ticket (Verified, Not Verified, Not Found)
     */
    function checkVerificationStatus(
        address myAddress,
        uint256 ticketId,
        uint256 eventId
    ) public view returns (string memory status) {
        require(eventExists[eventId], "Event does not exist");
        if (tickets[eventId].length == 0) {
            status = "Not Found";
        } else {
            for (uint256 i = 0; i < tickets[eventId].length; i++) {
                if (
                    tickets[eventId][i].id == ticketId &&
                    tickets[eventId][i].owner == myAddress &&
                    tickets[eventId][i].eventId == eventId
                ) {
                    if (tickets[eventId][i].verified) {
                        status = "Verified";
                        break;
                    } else {
                        status = "Not Verified";
                        break;
                    }
                } else if (i == tickets[eventId].length - 1) {
                    status = "Not Found";
                }
            }
        }
    }

    /**
     * @dev Get the ticket history for a specific event and ticket ID
     * @param eventId The ID of the event
     * @param ticketId The ID of the ticket
     * @return An array of addresses representing the history of the ticket (ownership transfer)
     */
    function getEventTicketHistory(
        uint256 eventId,
        uint256 ticketId
    ) public view returns (address[] memory) {
        return ticketHistory[eventId][ticketId];
    }

    /**
     * @notice Allows the owner of the event to withdraw the balance accumulated from ticket sales
     * @dev The event must have ended and the balance must be positive to initiate the payout
     * @param eventId The ID of the event for which the payout is requested
     */
    function payout(uint256 eventId) public {
        require(eventExists[eventId], "Event not found");
        require(!events[eventId].paidOut, "Event already paid out");
        require(currentTime() > events[eventId].endsAt, "Event still ongoing");
        require(
            events[eventId].owner == msg.sender || msg.sender == owner(),
            "Unauthorized entity"
        );

        events[eventId].paidOut = true;
        events[eventId].balance = 0;
        payTo(events[eventId].owner, events[eventId].balance);
    }

    /**
     * @notice Transfer the specified amount of funds to the specified address
     * @param to The address to which the funds will be transferred
     * @param amount The amount of funds to transfer
     * @dev Ensures that the contract has sufficient balance before transferring funds
     * @dev Emits a Payment event if the payment is successful
     */
    function payTo(address to, uint256 amount) internal {
        uint256 balance = address(this).balance;
        require(balance >= amount, "Insufficient balance");

        (bool success, ) = payable(to).call{value: amount}("");
        require(success, "Payment failed");
    }

    function currentTime() internal view returns (uint256) {
        return (block.timestamp * 1000) + 1000;
    }
}
