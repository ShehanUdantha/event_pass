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
      triggerSuccessToast("contract call success");
      console.info("contract call success", data);
    } catch (err) {
      triggerErrorToast(err);
      console.error("contract call failure", err);
    }
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
        minted: event.minted,
      }));

      console.info("contract call success", data);
    } catch (err) {
      triggerErrorToast(err);
      console.error("contract call failure", err);
    }

    return parsedEvents != null ? parsedEvents : [];
  };

  // 3. update event
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
      triggerSuccessToast("contract call success");
      console.info("contract call success", data);
    } catch (err) {
      triggerErrorToast(err);
      console.error("contract call failure", err);
    }
  };

  // 4. delete event
  const { mutateAsync: deleteEvent, isDeleteLoading } = useContractWrite(
    contract,
    "deleteEvent"
  );

  const callDeleteEvent = async (eventId) => {
    let isSuccess = false;
    try {
      const data = await deleteEvent({ args: [eventId] });
      isSuccess = true;
      triggerSuccessToast("contract call success");
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
    return isSuccess;
  };

  // 5. get my events
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
        minted: event.minted,
      }));

      console.info("contract call success", data);
    } catch (err) {
      triggerErrorToast(err);
      console.error("contract call failure", err);
    }

    return parsedEvents != null ? parsedEvents : [];
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
        updateEvent: callUpdateEvent,
        deleteEvent: callDeleteEvent,
        getMyEvents,
      }}
    >
      {children}
      <Toaster position="bottom-right" />
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
