import React, { useContext, createContext } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
  useContractRead,
  useContractEvents,
  useDisconnect,
  useConnectionStatus,
  useSigner,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../constants/index";
import { convertBigNumberToDate, convertBigNumberToInt } from "../utils";
import toast, { Toaster } from "react-hot-toast";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(CONTRACT_ADDRESS);

  const triggerSuccessToast = (message) => toast.success(message);
  const triggerErrorToast = (message) => toast.error(message);

  // console.log(contract);

  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();
  const connectionStatus = useConnectionStatus();
  const signer = useSigner();

  // contract functions

  // 1. create event
  const { mutateAsync: createEvent, isLoading } = useContractWrite(
    contract,
    "createEvent"
  );

  const callCreateEvent = async (form) => {
    const {
      title,
      description,
      imageUrl,
      ticketAmount,
      ticketCost,
      startsAt,
      endsAt,
      location,
      category,
    } = form;

    let isSuccess = false;

    try {
      const data = await createEvent({
        args: [
          title,
          description,
          imageUrl,
          ticketAmount,
          ticketCost,
          startsAt,
          endsAt,
          location,
          category,
        ],
      });
      isSuccess = true;
      triggerSuccessToast("contract call success");
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 2. get all events
  const getAllEvents = async () => {
    let parsedEvents = null;

    try {
      const data = await contract.call("getAllEvents");

      parsedEvents = data.map((event, i) => ({
        id: convertBigNumberToInt(event.id),
        title: event.title,
        description: event.description,
        imageUrl: event.imageUrl,
        ticketAmount: convertBigNumberToInt(event.ticketAmount),
        ticketRemain: convertBigNumberToInt(event.ticketRemain),
        ticketCost: ethers.utils.formatEther(event.ticketCost.toString()),
        startsAt: convertBigNumberToDate(event.startsAt),
        endsAt: convertBigNumberToDate(event.endsAt),
        location: event.location,
        category: event.category,
        owner: event.owner,
        timestamp: event.timestamp,
        deleted: event.deleted,
        paidOut: event.paidOut,
        refunded: event.refunded,
      }));

      console.info("contract call success", data);
    } catch (err) {
      triggerErrorToast(err);
      console.error("contract call failure", err);
    }

    return parsedEvents != null ? parsedEvents : [];
  };

  // 3. get single event
  const getSingleEvent = async (eventId) => {
    let parsedEvent = null;

    try {
      const data = await contract.call("getSingleEvent", [eventId]);

      parsedEvent = {
        id: convertBigNumberToInt(data.id),
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        ticketAmount: convertBigNumberToInt(data.ticketAmount),
        ticketRemain: convertBigNumberToInt(data.ticketRemain),
        ticketCost: ethers.utils.formatEther(data.ticketCost.toString()),
        startsAt: convertBigNumberToDate(data.startsAt),
        endsAt: convertBigNumberToDate(data.endsAt),
        location: data.location,
        category: data.category,
        owner: data.owner,
        timestamp: data.timestamp,
        deleted: data.deleted,
        paidOut: data.paidOut,
        refunded: data.refunded,
      };

      console.info("contract call success", data);
    } catch (err) {
      triggerErrorToast(err);
      console.error("contract call failure", err);
    }

    return parsedEvent != null ? parsedEvent : {};
  };

  // 4. update event
  const { mutateAsync: updateEvent, isUpdateLoading } = useContractWrite(
    contract,
    "updateEvent"
  );

  const callUpdateEvent = async (form) => {
    const {
      eventId,
      title,
      description,
      imageUrl,
      ticketAmount,
      ticketRemain,
      ticketCost,
      startsAt,
      endsAt,
      location,
      category,
    } = form;

    let isSuccess = false;

    try {
      const data = await updateEvent({
        args: [
          eventId,
          title,
          description,
          imageUrl,
          ticketAmount,
          ticketRemain,
          ticketCost,
          startsAt,
          endsAt,
          location,
          category,
        ],
      });
      isSuccess = true;
      triggerSuccessToast("contract call success");
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 5. delete event
  const { mutateAsync: deleteEvent, isDeleteLoading } = useContractWrite(
    contract,
    "deleteEvent"
  );

  const callDeleteEvent = async (eventId, isRefunded) => {
    let isSuccess = false;
    try {
      const data = await deleteEvent({ args: [eventId, isRefunded] });
      isSuccess = true;
      triggerSuccessToast("contract call success");
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 6. get my events
  const getMyEvents = async () => {
    let parsedEvents = null;

    try {
      const data = await contract.call("getMyEvents", [address]);
      console.log(data);

      parsedEvents = data.map((event, i) => ({
        id: convertBigNumberToInt(event.id),
        title: event.title,
        description: event.description,
        imageUrl: event.imageUrl,
        ticketAmount: convertBigNumberToInt(event.ticketAmount),
        ticketRemain: convertBigNumberToInt(event.ticketRemain),
        ticketCost: ethers.utils.formatEther(event.ticketCost.toString()),
        startsAt: convertBigNumberToDate(event.startsAt),
        endsAt: convertBigNumberToDate(event.endsAt),
        location: event.location,
        category: event.category,
        owner: event.owner,
        timestamp: event.timestamp,
        deleted: event.deleted,
        paidOut: event.paidOut,
        refunded: event.refunded,
      }));

      console.info("contract call success", data);
    } catch (err) {
      triggerErrorToast(err);
      console.error("contract call failure", err);
    }

    return parsedEvents != null ? parsedEvents : [];
  };

  // 7. buy tickets
  const { mutateAsync: buyTickets, isBuyTicketLoading } = useContractWrite(
    contract,
    "buyTickets"
  );

  const callBuyTickets = async ({ eventId, numOfTicket, ticketCost }) => {
    let isSuccess = false;

    try {
      const data = await buyTickets({
        args: [eventId, numOfTicket, window.location.origin],
        overrides: {
          gasLimit: 3000000, // override default gas limit
          value: ethers.utils.parseEther(
            (ticketCost * numOfTicket).toFixed(6).toString()
          ),
        },
      });
      isSuccess = true;
      triggerSuccessToast("contract call success");
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 8. get my tickets
  const getMyTickets = async () => {
    let parsedTickets = null;

    try {
      const data = await contract.call("getMyTickets", [address]);
      console.log(data);

      parsedTickets = data.map((ticket, i) => ({
        id: convertBigNumberToInt(ticket.id),
        eventId: convertBigNumberToInt(ticket.eventId),
        tokenId: convertBigNumberToInt(ticket.tokenId),
        owner: ticket.owner,
        ticketCost: ethers.utils.formatEther(ticket.ticketCost.toString()),
        timestamp: ticket.timestamp,
        qrCode: ticket.qrCode,
        verified: ticket.verified,
        reselled: ticket.reselled,
        refunded: ticket.refunded,
        minted: ticket.minted,
      }));

      console.info("contract call success", data);
    } catch (err) {
      triggerErrorToast(err);
      console.error("contract call failure", err);
    }

    return parsedTickets != null ? parsedTickets : [];
  };

  // 9. verify ticket
  const verifyTicket = async (myAddress, eventId, ticketId) => {
    let ticketVerificationInfo = "";

    try {
      const data = await contract.call("verifyTicket", [
        myAddress,
        ticketId,
        eventId,
      ]);
      console.log(data);

      ticketVerificationInfo = data;

      console.info("contract call success", data);
    } catch (err) {
      triggerErrorToast(err);
      console.error("contract call failure", err);
    }

    return ticketVerificationInfo;
  };

  // 10. get single ticket details
  const getSingleTicket = async (eventId, ticketId) => {
    let parsedTicket = null;

    try {
      const data = await contract.call("getSingleTicket", [eventId, ticketId]);
      console.log(data);

      parsedTicket = {
        id: convertBigNumberToInt(data.id),
        eventId: convertBigNumberToInt(data.eventId),
        tokenId: convertBigNumberToInt(data.tokenId),
        owner: data.owner,
        ticketCost: ethers.utils.formatEther(data.ticketCost.toString()),
        timestamp: data.timestamp,
        qrCode: data.qrCode,
        verified: data.verified,
        reselled: data.reselled,
        refunded: data.refunded,
        minted: data.minted,
      };

      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }

    return parsedTicket != null ? parsedTicket : { id: -1 };
  };

  // 11. resell ticket
  const { mutateAsync: resellTicket, isResellTicketLoading } = useContractWrite(
    contract,
    "resellTicket"
  );

  const callResellTicket = async (eventId, ticketId, myAddress) => {
    let isSuccess = false;

    try {
      const data = await resellTicket({
        args: [eventId, ticketId, myAddress],
      });
      isSuccess = true;
      triggerSuccessToast("contract call success");
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 12. get resell tickets by event id
  const getResellTicketsByEventId = async (eventId) => {
    let parsedTickets = null;

    try {
      const data = await contract.call("getResellTicketsByEventId", [eventId]);
      console.log(data);

      parsedTickets = data.map((ticket, i) => ({
        id: convertBigNumberToInt(ticket.id),
        eventId: convertBigNumberToInt(ticket.eventId),
        tokenId: convertBigNumberToInt(ticket.tokenId),
        owner: ticket.owner,
        ticketCost: ethers.utils.formatEther(ticket.ticketCost.toString()),
        timestamp: ticket.timestamp,
        qrCode: ticket.qrCode,
        refunded: ticket.refunded,
        minted: ticket.minted,
      }));

      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }

    return parsedTickets != null ? parsedTickets : [];
  };

  // 13. get back resell ticket
  const { mutateAsync: getBackResellTicket, isGetBackResellTicketLoading } =
    useContractWrite(contract, "getBackResellTicket");

  const callGetBackResellTicket = async (eventId, ticketId, myAddress) => {
    let isSuccess = false;

    try {
      const data = await getBackResellTicket({
        args: [eventId, ticketId, myAddress],
      });
      isSuccess = true;
      triggerSuccessToast("contract call success");
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 14. buy resell tickets
  const { mutateAsync: buyReselledTicket, isBuyResellTicketLoading } =
    useContractWrite(contract, "buyReselledTicket");

  const callBuyResellTickets = async (
    eventId,
    ticketId,
    newOwner,
    tokenId,
    ticketCost
  ) => {
    let isSuccess = false;

    try {
      const data = await buyReselledTicket({
        args: [eventId, ticketId, newOwner, window.location.origin, tokenId],
        overrides: {
          gasLimit: 3000000, // override default gas limit
          value: ethers.utils.parseEther(ticketCost.toString()),
        },
      });
      isSuccess = true;
      triggerSuccessToast("contract call success");
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 15. payout
  const { mutateAsync: payout, isPayoutLoading } = useContractWrite(
    contract,
    "payout"
  );

  const callPayout = async (eventId) => {
    let isSuccess = false;

    try {
      const data = await payout({
        args: [eventId],
      });
      isSuccess = true;
      triggerSuccessToast("contract call success");
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        disconnect,
        signer,
        createEvent: callCreateEvent,
        getAllEvents,
        getSingleEvent,
        updateEvent: callUpdateEvent,
        deleteEvent: callDeleteEvent,
        getMyEvents,
        buyTickets: callBuyTickets,
        getMyTickets,
        verifyTicket,
        getSingleTicket,
        resellTicket: callResellTicket,
        getResellTicketsByEventId,
        getBackResellTicket: callGetBackResellTicket,
        buyReselledTicket: callBuyResellTickets,
        payout: callPayout,
      }}
    >
      {children}
      <Toaster position="bottom-right" />
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
