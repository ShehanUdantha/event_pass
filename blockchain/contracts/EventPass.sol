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
    bool minted;
  }

  struct TicketStruct {
    uint256 id;
    uint256 eventId;
    address owner;
    uint256 ticketCost;
    uint256 timestamp;
    string qrCode;
    string verified;
    bool refunded;
    bool minted;
  }

  uint256 public balance;
  uint256 constant TOTALTICKETCANPURCHASE = 5;

  mapping(uint256 => EventStruct) events;
  mapping(uint256 => TicketStruct[]) tickets;
  mapping(address => TicketStruct[]) myTickets;
  mapping(uint256 => TicketStruct[]) secondaryTickets;
  mapping(uint256 => bool) eventExists;

  constructor() ERC721('EventPass', 'EP'){}

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
    require(bytes(location).length > 0, 'Title cannot be empty');
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
    require(bytes(location).length > 0, 'Title cannot be empty');
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
    require(msg.value >= events[eventId].ticketCost * numOfTicket, 'Insufficient amount');
    require(numOfTicket > 0, 'numOfTicket must be greater than zero');
    require(numOfTicket <= TOTALTICKETCANPURCHASE, 'numOfTicket must be less than 5');
    require(numOfTicket <= events[eventId].ticketRemain,'Out of tickets');
    require(bytes(baseUrl).length > 0, 'Url cannot be empty');

    uint256 userBoughtTickets = getNumberOfTicketUserByFromEvent(eventId, msg.sender);
    require(userBoughtTickets <= TOTALTICKETCANPURCHASE, 'Ticket purchase limit reached');
    require(userBoughtTickets + numOfTicket <= TOTALTICKETCANPURCHASE, 'You cannot purchase this amount of tickets, because you are limit the reached');

      if(userBoughtTickets <= TOTALTICKETCANPURCHASE && (userBoughtTickets + numOfTicket) <= TOTALTICKETCANPURCHASE){
        for (uint i = 0; i < numOfTicket; i++) {
          TicketStruct memory ticket;
          ticket.id = tickets[eventId].length;
          ticket.eventId = eventId;
          ticket.owner = msg.sender;
          ticket.ticketCost = events[eventId].ticketCost;
          ticket.timestamp = currentTime();
          ticket.qrCode = string(abi.encodePacked(baseUrl, "/ticket-info/", Strings.toHexString(uint256(uint160(msg.sender)), 20), "/", Strings.toString(eventId), "/", Strings.toString(tickets[eventId].length)));

          // push ticket to array
          tickets[eventId].push(ticket);
          myTickets[msg.sender].push(ticket);
        }

        events[eventId].ticketRemain -= numOfTicket;
        balance += msg.value;
      }
    
  }

  function getTickets(uint256 eventId) public view returns (TicketStruct[] memory Tickets) {
    return tickets[eventId];
  }

  function getMyTickets(address myAddress) public view returns (TicketStruct[] memory Tickets) {
    return myTickets[myAddress];
  }

  function getTicketInfo(address myAddress, uint256 ticketId) public view returns (TicketStruct memory) {
    return myTickets[myAddress][ticketId];
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
  
  function resellTicket(uint256 eventId, uint256 ticketId, address myAddress) external returns (bool) {
    require(tickets[eventId][ticketId].owner == myAddress, "You don't own this ticket");
    require(currentTime() < tickets[eventId][ticketId].timestamp, 'Event has already occurred');

    secondaryTickets[eventId].push(tickets[eventId][ticketId]);

    return true;
  }

  function getResellTicketsByEventId(uint256 eventId) public view returns (TicketStruct[] memory Tickets) {
    return secondaryTickets[eventId];
  }

  function buyReselledTicket(uint256 eventId, uint256 ticketId, address newOwner, string memory baseUrl) public payable {
    require(eventExists[eventId], 'Event not found');
    require(msg.value >= events[eventId].ticketCost, 'Insufficient amount');
    require(currentTime() < tickets[eventId][ticketId].timestamp, 'Event has already occurred');
    require(bytes(baseUrl).length > 0, 'Url cannot be empty');

    uint256 userBoughtTickets = getNumberOfTicketUserByFromEvent(eventId, newOwner);
    require(userBoughtTickets <= TOTALTICKETCANPURCHASE, 'Ticket purchase limit reached');
    require(userBoughtTickets + 1 <= TOTALTICKETCANPURCHASE, 'You cannot purchase this amount of tickets, because you are limit the reached');

    payTo(tickets[eventId][ticketId].owner, tickets[eventId][ticketId].ticketCost);

    // Transfer ownership of the ticket
    _transfer(tickets[eventId][ticketId].owner, newOwner, ticketId);
    
    tickets[eventId][ticketId].owner = newOwner;
    tickets[eventId][ticketId].qrCode = string(abi.encodePacked(baseUrl, "/ticket-info/", Strings.toHexString(uint256(uint160(msg.sender)), 20), "/", Strings.toString(eventId), "/", Strings.toString(tickets[eventId].length)));
    myTickets[newOwner].push(tickets[eventId][ticketId]);
    removeTicketFromSecondary(ticketId,tickets[eventId][ticketId].owner,eventId);
    
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

  function verifyTicket(address myAddress, uint256 ticketId, uint256 eventId) public view returns (string memory) {
    string memory isVerified = "Not verified";
    for (uint i = 0; i < tickets[eventId].length; i++) {
      if(Strings.equal(tickets[eventId][i].verified,"Verified")){
        isVerified = "Already Verified";
        break;
      }else if (tickets[eventId][i].owner == myAddress && tickets[eventId][i].id == ticketId) {
        isVerified = "Verified";
        break;
      }
    }
    return isVerified;
  }

  function payout(uint256 eventId) public {
    require(eventExists[eventId], 'Event not found');
    require(!events[eventId].paidOut, 'Event already paid out');
    require(currentTime() > events[eventId].endsAt, 'Event still ongoing');
    require(events[eventId].owner == msg.sender || msg.sender == owner(), 'Unauthorized entity');
    // minted all tickets
    require(mintTickets(eventId), 'Event failed to mint');

    uint256 revenue = events[eventId].ticketCost * (events[eventId].ticketAmount - events[eventId].ticketRemain);

    payTo(events[eventId].owner, revenue);

    events[eventId].paidOut = true;
    balance -= revenue;
  }

  function mintTickets(uint256 eventId) internal returns (bool) {
    for (uint i = 0; i < tickets[eventId].length; i++) {
      _totalTokens.increment();
      tickets[eventId][i].minted = true;
      _mint(tickets[eventId][i].owner, _totalTokens.current());
    }

    events[eventId].minted = true;
    return true;
  }

  function payTo(address to, uint256 amount) internal {
    (bool success, ) = payable(to).call{ value: amount }('');
    require(success);
  }

  function currentTime() internal view returns (uint256) {
    return (block.timestamp * 1000) + 1000;
  }

  function removeTicketFromSecondary(uint256 ticketIdToRemove, address ownerAddress, uint256 eventId) internal {
    for (uint i = 0; i < secondaryTickets[eventId].length; i++) {
      if(secondaryTickets[eventId][i].owner == ownerAddress){
        if (secondaryTickets[eventId][i].id == ticketIdToRemove) {
        // Swap with the last element
        secondaryTickets[eventId][i] = secondaryTickets[eventId][secondaryTickets[eventId].length - 1];
        // Delete the last element
        secondaryTickets[eventId].pop();
        break;
      }
      }
    }
  }
}