// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
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
    uint256 sales;
    uint256 ticketCost;
    uint256 ticketAmount;
    uint256 ticketRemain;
    uint256 startsAt;
    uint256 endsAt;
    uint256 timestamp;
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
    bool refunded;
    bool minted;
  }

  uint256 public balance;
  uint256 constant TOTALTICKETCANPURCHASE = 5;

  mapping(uint256 => EventStruct) events;
  mapping(uint256 => TicketStruct[]) tickets;
  mapping(uint256 => bool) eventExists;

  constructor() ERC721('EventPass', 'EP') {}

  function createEvent(
    string memory title,
    string memory description,
    string memory imageUrl,
    uint256 ticketAmount,
    uint256 ticketCost,
    uint256 startsAt,
    uint256 endsAt
  ) public {
    require(ticketCost > 0 ether, 'TicketCost must be greater than zero');
    require(ticketAmount > 0, 'TicketAmount must be greater than zero');
    require(bytes(title).length > 0, 'Title cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(bytes(imageUrl).length > 0, 'ImageUrl cannot be empty');
    require(startsAt > 0, 'Start date must be greater than zero');
    require(endsAt > startsAt, 'End date must be greater than start date');

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

    eventExists[newEvent.id] = true;
    events[newEvent.id] = newEvent;
  }

  function updateEvent(
    uint256 eventId,
    string memory title,
    string memory description,
    string memory imageUrl,
    uint256 ticketAmount,
    uint256 ticketCost,
    uint256 startsAt,
    uint256 endsAt
  ) public {
    require(eventExists[eventId], 'Event not found');
    require(events[eventId].owner == msg.sender, 'Unauthorized entity');
    require(ticketCost > 0 ether, 'TicketCost must be greater than zero');
    require(ticketAmount > 0, 'TicketAmount must be greater than zero');
    require(bytes(title).length > 0, 'Title cannot be empty');
    require(bytes(description).length > 0, 'Description cannot be empty');
    require(bytes(imageUrl).length > 0, 'ImageUrl cannot be empty');
    require(startsAt > 0, 'Start date must be greater than zero');
    require(endsAt > startsAt, 'End date must be greater than start date');

    events[eventId].title = title;
    events[eventId].description = description;
    events[eventId].imageUrl = imageUrl;
    events[eventId].ticketAmount = ticketAmount;
    events[eventId].ticketCost = ticketCost;
    events[eventId].startsAt = startsAt;
    events[eventId].endsAt = endsAt;
  }

  function deleteEvent(uint256 eventId) public {
    require(eventExists[eventId], 'Event not found');
    require(events[eventId].owner == msg.sender || msg.sender == owner(), 'Unauthorized entity');
    require(!events[eventId].paidOut, 'Event already paid out');
    require(!events[eventId].refunded, 'Event already refunded');
    require(!events[eventId].deleted, 'Event already deleted');
    require(refundTickets(eventId), 'Event failed to refund');

    events[eventId].deleted = true;
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

  function getMyEvents() public view returns (EventStruct[] memory Events) {
      uint256 available;

    for (uint256 i = 1; i <= _totalEvents.current(); i++) {
      if (!events[i].deleted && events[i].owner == msg.sender) {
        available++;
      }
    }
    Events = new EventStruct[](available);
    uint256 index;

    for (uint256 i = 1; i <= _totalEvents.current(); i++) {
      if (!events[i].deleted && events[i].owner == msg.sender) {
        Events[index++] = events[i];
      }
    }
  }

  function getSingleEvent(uint256 eventId) public view returns (EventStruct memory) {
    return events[eventId];
  }

  function buyTickets(uint256 eventId, uint256 numOfticket) public payable {
    require(eventExists[eventId], 'Event not found');
    require(msg.value >= events[eventId].ticketCost * numOfticket, 'Insufficient amount');
    require(numOfticket > 0, 'NumOfticket must be greater than zero');
    require(numOfticket > TOTALTICKETCANPURCHASE, 'NumOfticket must be less than 5');
    require(numOfticket < events[eventId].ticketRemain,'Out of tickets');

    for (uint i = 0; i < numOfticket; i++) {
      TicketStruct memory ticket;
      ticket.id = tickets[eventId].length;
      ticket.eventId = eventId;
      ticket.owner = msg.sender;
      ticket.ticketCost = events[eventId].ticketCost;
      ticket.timestamp = currentTime();
      tickets[eventId].push(ticket);
    }

    events[eventId].ticketRemain -= numOfticket;
    balance += msg.value;
  }

  function getTickets(uint256 eventId) public view returns (TicketStruct[] memory Tickets) {
    return tickets[eventId];
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

  
  function resellTicket(uint256 eventId,uint256 ticketId, address newOwner) external returns (bool) {
    require(tickets[eventId][ticketId].owner == msg.sender, "You don't own this ticket");
    require(newOwner != msg.sender, "Cannot resell to yourself");
    require(currentTime() < tickets[eventId][ticketId].timestamp, 'Event has already occurred'); 
        
    TicketStruct memory sellTicket;
    // Transfer ownership of the ticket
    _transfer(msg.sender, newOwner, ticketId);
    sellTicket.owner = newOwner;
    return true;
  }

  function payout(uint256 eventId) public {
    require(eventExists[eventId], 'Event not found');
    require(!events[eventId].paidOut, 'Event already paid out');
    require(currentTime() > events[eventId].endsAt, 'Event still ongoing'); // disable while testing
    require(events[eventId].owner == msg.sender || msg.sender == owner(), 'Unauthorized entity');
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
}