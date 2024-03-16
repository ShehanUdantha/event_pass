// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract EventPass is Ownable, ReentrancyGuard, ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _totalEvents;
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
  }

  struct TicketStruct {
    uint256 id;
    uint256 eventId;
    uint256 tokenId;
    address owner;
    uint256 ticketCost;
    uint256 timestamp;
    string qrCode;
    string verified;
    bool reselled;
    bool refunded;
    bool minted;
  }

  uint256 public balance = 0;
  uint256 public TOTAL_TICKETS_CAN_PURCHASE = 5;

  mapping(uint256 => EventStruct) events;
  mapping(uint256 => TicketStruct[]) tickets;
  mapping(address => TicketStruct[]) myTickets;
  mapping(uint256 => mapping(uint256 => address[])) ticketHistory;
  mapping(uint256 => bool) eventExists;

  constructor() ERC721('EventPass', 'EP'){}

  function changeTotalTicketsCanPurchase(uint256 newAmount) public onlyOwner {
    TOTAL_TICKETS_CAN_PURCHASE = newAmount;
  }

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
    require(ticketCost > 0 ether, 'TicketCost must be greater than zero');
    require(ticketAmount > 0, 'TicketAmount must be greater than zero');
    require(bytes(title).length > 0, 'Title cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(bytes(imageUrl).length > 0, 'ImageUrl cannot be empty');
    require(startsAt > 0, 'Start date must be greater than zero');
    require(endsAt > startsAt, 'End date must be greater than start date');
    require(bytes(location).length > 0, 'Location cannot be empty');
    require(bytes(category).length > 0, 'Category cannot be empty');

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
    require(eventExists[eventId], 'Event not found');
    require(events[eventId].owner == msg.sender, 'Unauthorized entity');
    require(ticketCost > 0 ether, 'TicketCost must be greater than zero');
    require(ticketAmount > 0, 'TicketAmount must be greater than zero');
    require(ticketRemain > 0, 'TicketRemain must be greater than zero');
    require(bytes(title).length > 0, 'Title cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(bytes(imageUrl).length > 0, 'ImageUrl cannot be empty');
    require(startsAt > 0, 'Start date must be greater than zero');
    require(endsAt > startsAt, 'End date must be greater than start date');
    require(bytes(location).length > 0, 'Location cannot be empty');
    require(bytes(category).length > 0, 'Category cannot be empty');

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
    require(eventExists[eventId], 'Event not found');
    require(events[eventId].owner == msg.sender || msg.sender == owner(), 'Unauthorized entity');
    require(!events[eventId].paidOut, 'Event already paid out');
    require(!events[eventId].refunded, 'Event already refunded');
    require(!events[eventId].deleted, 'Event already deleted');

    if(isRefunded == true){
      refundTickets(eventId);
      events[eventId].deleted = true;
    }else{
      events[eventId].deleted = true;
    }
  }

  function getAllEvents() public view returns (EventStruct[] memory Events) {
    uint256 available;

    for (uint256 i = 1; i <= _totalEvents.current(); i++) {
      if (!events[i].deleted) {
        available++;
      }
    }

    Events = new EventStruct[](available);
    uint256 index;

    for (uint256 i = 1; i <= _totalEvents.current(); i++) {
      if (!events[i].deleted) {
        Events[index++] = events[i];
      }
    }
  }

  function getMyEvents(address myAddress) public view returns (EventStruct[] memory Events) {
    uint256 available;

    for (uint256 i = 1; i <= _totalEvents.current(); i++) {
      if (!events[i].deleted && events[i].owner == myAddress) {
        available++;
      }
    }
    Events = new EventStruct[](available);
    uint256 index;

    for (uint256 i = 1; i <= _totalEvents.current(); i++) {
      if (!events[i].deleted && events[i].owner == myAddress) {
        Events[index++] = events[i];
      }
    }
  }

  function getSingleEvent(uint256 eventId) public view returns (EventStruct memory) {
    return events[eventId];
  }

  function buyTickets(uint256 eventId, uint256 numOfTicket, string memory baseUrl) public payable {
    require(eventExists[eventId], 'Event not found');
    require(events[eventId].owner != msg.sender, "You can't purchase a ticket");
    require(msg.value >= events[eventId].ticketCost * numOfTicket, 'Insufficient amount');
    require(numOfTicket > 0, 'numOfTicket must be greater than zero');
    require(numOfTicket <= TOTAL_TICKETS_CAN_PURCHASE, 'numOfTicket must be less than 5');
    require(numOfTicket <= events[eventId].ticketRemain,'Out of tickets');
    require(bytes(baseUrl).length > 0, 'Url cannot be empty');

    uint256 userBoughtTickets = getNumberOfTicketUserByFromEvent(eventId, msg.sender);
    require(userBoughtTickets <= TOTAL_TICKETS_CAN_PURCHASE, 'Ticket purchase limit reached');
    require(userBoughtTickets + numOfTicket <= TOTAL_TICKETS_CAN_PURCHASE, 'You cannot purchase this amount of tickets');

      if(userBoughtTickets <= TOTAL_TICKETS_CAN_PURCHASE && (userBoughtTickets + numOfTicket) <= TOTAL_TICKETS_CAN_PURCHASE){
        for (uint i = 0; i < numOfTicket; i++) {
          TicketStruct memory ticket;
          ticket.id = tickets[eventId].length;
          ticket.eventId = eventId;
          ticket.owner = msg.sender;
          ticket.ticketCost = events[eventId].ticketCost;
          ticket.timestamp = currentTime();
          ticket.qrCode = string(abi.encodePacked(baseUrl, "/ticket-info/", Strings.toHexString(uint256(uint160(msg.sender)), 20), "/", Strings.toString(eventId), "/", Strings.toString(tickets[eventId].length)));
          ticket.verified = "Not Verified";

          // mint ticket
          _totalTokens.increment();
          _mint(msg.sender, _totalTokens.current());
          ticket.minted = true;
          ticket.tokenId = _totalTokens.current();

          tickets[eventId].push(ticket);
          myTickets[msg.sender].push(ticket);
          ticketHistory[eventId][ticket.id].push(events[eventId].owner);
          ticketHistory[eventId][ticket.id].push(msg.sender);
        }

        events[eventId].ticketRemain -= numOfTicket;
        balance += msg.value;
      }
    
  }

  function getAllTicketsByEvent(uint256 eventId) public view returns (TicketStruct[] memory Tickets) {
     return tickets[eventId];
  }

  function getSingleTicket(uint256 eventId, uint256 ticketId) public view returns (TicketStruct memory) {
    return tickets[eventId][ticketId];
  }

  function getMyTickets(address myAddress) public view returns (TicketStruct[] memory Tickets) {
    return myTickets[myAddress];
  }

  function refundTickets(uint256 eventId) internal returns (bool) {
    for (uint i = 0; i < tickets[eventId].length; i++) {
      tickets[eventId][i].refunded = true;
      payTo(tickets[eventId][i].owner, tickets[eventId][i].ticketCost);
      balance -= tickets[eventId][i].ticketCost;
    }

    events[eventId].refunded = true;
    return true;
  }
  
  function resellTicket(uint256 eventId, uint256 ticketId, address myAddress) public {
    require(tickets[eventId][ticketId].owner == myAddress, "You don't own this ticket");
    require(currentTime() < events[eventId].startsAt, 'Event has already occurred');

    tickets[eventId][ticketId].reselled = true;
    myTickets[myAddress][ticketId].reselled = true;
  }

  function getBackResellTicket(uint256 eventId, uint256 ticketId, address myAddress) public {
    require(tickets[eventId][ticketId].owner == myAddress, "You don't own this ticket");

    tickets[eventId][ticketId].reselled = false;
    myTickets[myAddress][ticketId].reselled = false;
  }

  function getResellTicketsByEventId(uint256 eventId) public view returns (TicketStruct[] memory Tickets) {
    uint256 available;

    for (uint256 i = 0; i < tickets[eventId].length; i++) {
      if (tickets[eventId][i].reselled) {
        available++;
      }
    }

    Tickets = new TicketStruct[](available);
    uint256 index;

    for (uint256 i = 0; i < tickets[eventId].length; i++) {
      if (tickets[eventId][i].reselled) {
        Tickets[index++] = tickets[eventId][i];
      }
    }
  }

  function buyReselledTicket(uint256 eventId, uint256 ticketId, address newOwner, string memory baseUrl, uint256 tokenId) public payable {
    require(eventExists[eventId], 'Event not found');
    require(tickets[eventId][ticketId].owner != newOwner, "You can't purchase this ticket");
    require(msg.value >= events[eventId].ticketCost, 'Insufficient amount');
    require(currentTime() < events[eventId].startsAt, 'Event has already occurred');
    require(bytes(baseUrl).length > 0, 'Url cannot be empty');

    uint256 userBoughtTickets = getNumberOfTicketUserByFromEvent(eventId, newOwner);
    require(userBoughtTickets <= TOTAL_TICKETS_CAN_PURCHASE, 'Ticket purchase limit reached');
    require(userBoughtTickets + 1 <= TOTAL_TICKETS_CAN_PURCHASE, 'You cannot purchase this amount of tickets');

    payTo(tickets[eventId][ticketId].owner, tickets[eventId][ticketId].ticketCost);
    // Transfer ownership of the ticket token
    _transfer(tickets[eventId][ticketId].owner, newOwner, tokenId);
  
    removeTicketFromMyTickets(ticketId,tickets[eventId][ticketId].owner,eventId);

    tickets[eventId][ticketId].owner = newOwner;
    tickets[eventId][ticketId].qrCode = string(abi.encodePacked(baseUrl, "/ticket-info/", Strings.toHexString(uint256(uint160(msg.sender)), 20), "/", Strings.toString(eventId), "/", Strings.toString(tickets[eventId].length)));
    tickets[eventId][ticketId].reselled = false;
    myTickets[newOwner].push(tickets[eventId][ticketId]);
    ticketHistory[eventId][ticketId].push(newOwner);
  }

  function getNumberOfTicketUserByFromEvent(uint256 eventId, address myAddress) public view returns (uint256) {
    uint available;

    for (uint i = 0; i < tickets[eventId].length; i++) {
      if (tickets[eventId][i].owner == myAddress) {
        available++;
      }
    }
    return available;
  }

  function verifyTicket(address myAddress, uint256 ticketId, uint256 eventId) public returns (string memory) {
    string memory isVerified = "Not Found";
    for (uint i = 0; i < tickets[eventId].length; i++) {
      if(keccak256(abi.encodePacked(tickets[eventId][i].verified)) == keccak256(abi.encodePacked("Verified"))){
        isVerified = "Already Verified";
        break;
      }else if (tickets[eventId][i].owner == myAddress && tickets[eventId][i].id == ticketId) {
        tickets[eventId][i].verified = "Verified";
        myTickets[myAddress][i].verified = "Verified";
        isVerified = "Verified";
        break;
      }else if(keccak256(abi.encodePacked(tickets[eventId][i].verified)) == keccak256(abi.encodePacked("Not Verified"))){
         isVerified = "Not Verified";
         break;
      }
    }
    return isVerified;
  }

  function getEventTicketHistory(uint256 eventId, uint256 ticketId) public view returns (address[] memory) {
    return ticketHistory[eventId][ticketId];
  }

  function payout(uint256 eventId) public {
    require(eventExists[eventId], 'Event not found');
    require(!events[eventId].paidOut, 'Event already paid out');
    require(currentTime() > events[eventId].endsAt, 'Event still ongoing');
    require(events[eventId].owner == msg.sender || msg.sender == owner(), 'Unauthorized entity');

    uint256 revenue = events[eventId].ticketCost * (events[eventId].ticketAmount - events[eventId].ticketRemain);

    payTo(events[eventId].owner, revenue);
    events[eventId].paidOut = true;
    balance -= revenue;
  }

  function payTo(address to, uint256 amount) internal {
    (bool success, ) = payable(to).call{ value: amount }('');
    require(success);
  }

  function currentTime() internal view returns (uint256) {
    return (block.timestamp * 1000) + 1000;
  }

  function removeTicketFromMyTickets(uint256 ticketIdToRemove, address ownerAddress, uint256 eventId) internal {
    for (uint i = 0; i < myTickets[ownerAddress].length; i++) {
      if(myTickets[ownerAddress][i].eventId == eventId){
        if (myTickets[ownerAddress][i].id == ticketIdToRemove) {
        myTickets[ownerAddress][i] = myTickets[ownerAddress][myTickets[ownerAddress].length - 1];
        myTickets[ownerAddress].pop();
        break;
        }
      }
    }
  }
}