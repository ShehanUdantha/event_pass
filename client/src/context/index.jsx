import React, { useContext, createContext } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useCoinbaseWallet,
  useContractWrite,
  useDisconnect,
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
  let usedWallet = useMetamask();
  usedWallet = useCoinbaseWallet();
  const connect = usedWallet;
  const disconnect = useDisconnect();
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
      triggerSuccessToast("event created successfully!");
      // console.info("contract call success", data);
    } catch (err) {
      // triggerErrorToast(err.errorArgs[0]);
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 2. get all events
  const getAllEvents = async () => {
    let parsedEvents = null;

    try {
      const data = await contract.call("getAllEvents");

      parsedEvents = data
        .filter((event) => {
          const eventEndDate = new Date(convertBigNumberToDate(event.endsAt));
          const now = new Date();
          return event.paidOut === false && eventEndDate >= now;
        })
        .map((event, i) => ({
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
          balance: convertBigNumberToInt(event.balance),
        }));
      // console.info("contract call success", data);
    } catch (err) {
      // triggerErrorToast(err);
      console.error("contract call failure", err);
    }

    return parsedEvents != null ? parsedEvents : [];
  };

  // 3. add event media
  const { mutateAsync: addEventMedia, isAddMediaLoading } = useContractWrite(
    contract,
    "addEventMedia"
  );

  const callAddEventMedia = async (form) => {
    const { eventId, title, videoUrl } = form;

    let isSuccess = false;
    try {
      const data = await addEventMedia({
        args: [eventId, title, videoUrl],
      });

      isSuccess = true;
      triggerSuccessToast("event media added successfully!");
      // console.info("contract call success", data);
    } catch (err) {
      // triggerErrorToast(err.errorArgs[0]);
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 4. delete event media
  const { mutateAsync: deleteEventMedia, isDeleteMediaLoading } =
    useContractWrite(contract, "deleteEventMedia");

  const callDeleteEventMedia = async (eventId, mediaId) => {
    let isSuccess = false;
    try {
      const data = await deleteEventMedia({ args: [eventId, mediaId] });
      isSuccess = true;
      triggerSuccessToast("event media deleted successfully!");
      // console.info("contract call success", data);
    } catch (err) {
      // triggerErrorToast(err.errorArgs[0]);
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 5. get all event media by event id
  const getEventMediaByEventId = async (eventId) => {
    let parsedMedia = null;

    try {
      const data = await contract.call("getEventMediaByEventId", [eventId]);

      parsedMedia = data
        .filter((media) => media.deleted === false)
        .map((media, i) => ({
          id: convertBigNumberToInt(media.id),
          eventId: convertBigNumberToInt(media.eventId),
          title: media.title,
          videoUrl: media.videoUrl,
          timestamp: media.timestamp,
        }));
      // console.info("contract call success", data);
    } catch (err) {
      // triggerErrorToast(err.errorArgs[0]);
      console.error("contract call failure", err);
    }

    return parsedMedia != null ? parsedMedia : [];
  };

  // 6. get single event
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
        balance: convertBigNumberToInt(data.balance),
        eventMedia: data.eventMedia,
      };

      // console.info("contract call success", data);
    } catch (err) {
      // triggerErrorToast(err);
      console.error("contract call failure", err);
    }

    return parsedEvent != null ? parsedEvent : { id: 0 };
  };

  // 7. update event
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
      triggerSuccessToast("event updated successfully!");
      // console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 8. delete event
  const { mutateAsync: deleteEvent, isDeleteLoading } = useContractWrite(
    contract,
    "deleteEvent"
  );

  const callDeleteEvent = async (eventId, isRefunded) => {
    let isSuccess = false;
    try {
      const data = await deleteEvent({ args: [eventId, isRefunded] });
      isSuccess = true;
      triggerSuccessToast("event deleted successfully!");
      // console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 9. get my events
  const getMyEvents = async () => {
    let parsedEvents = null;

    try {
      const data = await contract.call("getAllEvents");

      parsedEvents = data
        .filter((event) => event.owner === address)
        .map((event, i) => ({
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

      // console.info("contract call success", data);
    } catch (err) {
      // triggerErrorToast(err);
      console.error("contract call failure", err);
    }

    return parsedEvents != null ? parsedEvents : [];
  };

  // 10. buy tickets
  const { mutateAsync: buyTickets, isBuyTicketLoading } = useContractWrite(
    contract,
    "buyTickets"
  );

  const callBuyTickets = async ({
    eventId,
    numOfTicket,
    ticketCost,
    tokenURIs,
  }) => {
    let isSuccess = false;

    try {
      const data = await buyTickets({
        args: [eventId, numOfTicket, window.location.origin, tokenURIs],
        overrides: {
          gasLimit: 3000000, // override default gas limit
          value: ethers.utils.parseEther(
            (ticketCost * numOfTicket).toFixed(6).toString()
          ),
        },
      });
      isSuccess = true;
      triggerSuccessToast("tickets purchased successfully!");
      // console.info("contract call success", data.transactionHash);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 11. get my tickets
  const getMyTickets = async () => {
    let parsedTickets = null;

    try {
      const data = await contract.call("getMyTickets", [address]);
      // console.log(data);

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
        isWaitingForRefund: ticket.isWaitingForRefund,
        refunded: ticket.refunded,
        minted: ticket.minted,
        verifiedTimestamp: ticket.verifiedTimestamp,
        refundTimestamp: ticket.refundTimestamp,
      }));

      // console.info("contract call success", data);
    } catch (err) {
      // triggerErrorToast(err);
      console.error("contract call failure", err);
    }

    return parsedTickets != null ? parsedTickets : [];
  };

  // 12. get all tickets by event
  const getAllTicketsByEvent = async (eventId) => {
    let parsedTickets = null;

    try {
      const data = await contract.call("getAllTicketsByEvent", [eventId]);
      // console.log(data);

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
        isWaitingForRefund: ticket.isWaitingForRefund,
        refunded: ticket.refunded,
        minted: ticket.minted,
        verifiedTimestamp: ticket.verifiedTimestamp,
        refundTimestamp: ticket.refundTimestamp,
      }));

      // console.info("contract call success", data);
    } catch (err) {
      // triggerErrorToast(err);
      console.error("contract call failure", err);
    }

    return parsedTickets != null ? parsedTickets : [];
  };

  // 13. get single ticket details
  const getSingleTicket = async (eventId, ticketId) => {
    let parsedTicket = null;

    try {
      const data = await contract.call("getSingleTicket", [eventId, ticketId]);
      // console.log(data);

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
        isWaitingForRefund: data.isWaitingForRefund,
        refunded: data.refunded,
        minted: data.minted,
        verifiedTimestamp: data.verifiedTimestamp,
        refundTimestamp: data.refundTimestamp,
      };

      // console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }

    return parsedTicket != null ? parsedTicket : { id: -1 };
  };

  // 14. verify ticket
  const { mutateAsync: verifyTicket, isVerifyLoading } = useContractWrite(
    contract,
    "verifyTicket"
  );
  const callVerifyTicket = async (myAddress, ticketId, eventId) => {
    try {
      const data = await verifyTicket({ args: [myAddress, ticketId, eventId] });

      // console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  // 15. check verification ticket
  const checkVerificationStatus = async (myAddress, ticketId, eventId) => {
    let ticketVerificationInfo = "";

    try {
      const data = await contract.call("checkVerificationStatus", [
        myAddress,
        ticketId,
        eventId,
      ]);
      // console.log(data);

      ticketVerificationInfo = data;

      // console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }

    return ticketVerificationInfo;
  };

  // 16. resell or unsell ticket
  const { mutateAsync: resellOrUnsellTicket, isResellOrUnSellTicketLoading } =
    useContractWrite(contract, "resellOrUnsellTicket");

  const callResellOrUnSellTicket = async (
    eventId,
    ticketId,
    myAddress,
    status
  ) => {
    let isSuccess = false;

    try {
      const data = await resellOrUnsellTicket({
        args: [eventId, ticketId, myAddress, status],
      });
      isSuccess = true;
      triggerSuccessToast(
        status
          ? "ticket reselled successfully!"
          : "reselled ticket canceled successfully!"
      );
      // console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 17. get resell tickets by event id
  const getResellTicketsByEventId = async (eventId) => {
    let parsedTickets = null;

    try {
      const data = await contract.call("getAllTicketsByEvent", [eventId]);
      // console.log(data);

      parsedTickets = data
        .filter((ticket) => ticket.reselled === true)
        .map((ticket, i) => ({
          id: convertBigNumberToInt(ticket.id),
          eventId: convertBigNumberToInt(ticket.eventId),
          tokenId: convertBigNumberToInt(ticket.tokenId),
          owner: ticket.owner,
          ticketCost: ethers.utils.formatEther(ticket.ticketCost.toString()),
          timestamp: ticket.timestamp,
          qrCode: ticket.qrCode,
          verified: ticket.verified,
          reselled: ticket.reselled,
          isWaitingForRefund: ticket.isWaitingForRefund,
          refunded: ticket.refunded,
          minted: ticket.minted,
          verifiedTimestamp: ticket.verifiedTimestamp,
          refundTimestamp: ticket.refundTimestamp,
        }));
      // console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }

    return parsedTickets != null ? parsedTickets : [];
  };

  // 18. buy resell tickets
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
      triggerSuccessToast("resell ticket purchased successfully!");
      // console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 19. get event ticket history
  const getEventTicketHistory = async (eventId, ticketId) => {
    let parsedTicketHistory = null;
    try {
      const data = await contract.call("getEventTicketHistory", [
        eventId,
        ticketId,
      ]);
      // console.log(data);
      parsedTicketHistory = data;

      // console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }

    return parsedTicketHistory != null ? parsedTicketHistory : [];
  };

  // 20. request or cancel refund
  const {
    mutateAsync: requestOrCancelRefundTicket,
    isRequestOrCancelRefundLoading,
  } = useContractWrite(contract, "requestOrCancelRefundTicket");

  const callRequestOrCancelRefundTicket = async (eventId, ticketId, status) => {
    let isSuccess = false;

    try {
      const data = await requestOrCancelRefundTicket({
        args: [eventId, ticketId, status],
      });
      isSuccess = true;
      triggerSuccessToast(
        `ticket refund ${status ? "requested" : "canceled"} successfully!`
      );
      // console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 21. refund ticket
  const { mutateAsync: refundTicket, isRefundLoading } = useContractWrite(
    contract,
    "refundTicket"
  );

  const callRefund = async (eventId, ticketId) => {
    let isSuccess = false;

    try {
      const data = await refundTicket({ args: [eventId, ticketId] });
      isSuccess = true;
      triggerSuccessToast("requested ticket refund successfully!");
      // console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 22. payout
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
      triggerSuccessToast("event salary withdraw successfully!");
      // console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 23. get contract owner
  const getContractOwner = async () => {
    let contractOwner = null;
    try {
      const data = await contract.call("owner", []);
      contractOwner = data;

      // console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }

    return contractOwner != null ? contractOwner : "";
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
        addEventMedia: callAddEventMedia,
        deleteEventMedia: callDeleteEventMedia,
        getEventMediaByEventId,
        getSingleEvent,
        updateEvent: callUpdateEvent,
        deleteEvent: callDeleteEvent,
        getMyEvents,
        buyTickets: callBuyTickets,
        getMyTickets,
        verifyTicket: callVerifyTicket,
        checkVerificationStatus,
        getAllTicketsByEvent,
        getSingleTicket,
        resellOrUnsellTicket: callResellOrUnSellTicket,
        getResellTicketsByEventId,
        buyReselledTicket: callBuyResellTickets,
        requestOrCancelRefundTicket: callRequestOrCancelRefundTicket,
        refundTicket: callRefund,
        getEventTicketHistory,
        payout: callPayout,
        getContractOwner,
      }}
    >
      {children}
      <Toaster position="bottom-center" />
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
