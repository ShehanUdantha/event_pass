// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EventPass is Ownable, ReentrancyGuard, ERC721URIStorage {
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
        uint256 verifiedTimestamp;
        uint256 refundTimestamp;
    }

    uint256 private constant TOTAL_TICKETS_CAN_PURCHASE = 4;

    mapping(uint256 => EventStruct) private events;
    mapping(uint256 => TicketStruct[]) private tickets;
    mapping(uint256 => mapping(uint256 => address[])) private ticketHistory;
    mapping(uint256 => bool) private eventExists;

    constructor() ERC721("EventPass", "EP") {}

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
    }

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

    function getSingleEvent(
        uint256 eventId
    ) public view returns (EventStruct memory) {
        return events[eventId];
    }

    function buyTickets(
        uint256 eventId,
        uint256 numOfTicket,
        string memory baseUrl,
        string[] memory tokenURIs
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
                _safeMint(msg.sender, _totalTokens.current());
                _setTokenURI(_totalTokens.current(), tokenURIs[i]);
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
        }
    }

    function getAllTicketsByEvent(
        uint256 eventId
    ) public view returns (TicketStruct[] memory Tickets) {
        return tickets[eventId];
    }

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
                false,
                0,
                0
            );
    }

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
                tickets[eventId][i].refundTimestamp = currentTime();
                break;
            }
        }
    }

    function cancelRefundTicket(uint256 eventId, uint256 ticketId) public {
        for (uint256 i = 0; i < tickets[eventId].length; i++) {
            if (
                !tickets[eventId][i].refunded &&
                tickets[eventId][i].id == ticketId
            ) {
                tickets[eventId][i].isWaitingForRefund = false;
                tickets[eventId][i].refundTimestamp = 0;
                break;
            }
        }
    }

    function refundTicket(uint256 eventId, uint256 ticketId) public {
        require(eventExists[eventId], "Event not found");
        require(
            events[eventId].owner == msg.sender || msg.sender == owner(),
            "Unauthorized entity"
        );

        for (uint256 i = 0; i < tickets[eventId].length; i++) {
            if (tickets[eventId][i].id == ticketId) {
                tickets[eventId][i].refunded = true;
                tickets[eventId][i].isWaitingForRefund = false;
                tickets[eventId][i].refundTimestamp = currentTime();

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

    function refundTickets(uint256 eventId) internal returns (bool) {
        for (uint i = 0; i < tickets[eventId].length; i++) {
            tickets[eventId][i].refunded = true;
            tickets[eventId][i].isWaitingForRefund = false;
            tickets[eventId][i].refundTimestamp = currentTime();
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
                break;
            }
        }
    }

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
                tickets[eventId][i].verifiedTimestamp = currentTime();
                break;
            }
        }
    }

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

    function getEventTicketHistory(
        uint256 eventId,
        uint256 ticketId
    ) public view returns (address[] memory) {
        return ticketHistory[eventId][ticketId];
    }

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

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success, "Payment failed");
    }

    function currentTime() internal view returns (uint256) {
        return (block.timestamp * 1000) + 1000;
    }
}
