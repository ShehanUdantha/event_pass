import React, { useContext, createContext } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
  useContractRead,
  useContractEvents,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../constants/index";
import { convertBigNumberToDate, convertBigNumberToInt } from "../utils";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(CONTRACT_ADDRESS);

  // console.log(contract);

  const address = useAddress();
  const connect = useMetamask();

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
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  // 2. get all events
  const getAllEvents = async () => {
    const data = await contract.call("getAllEvents");

    const parsedEvents = data.map((event, i) => ({
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

    return parsedEvents;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createEvent: callCreateEvent,
        getAllEvents,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
