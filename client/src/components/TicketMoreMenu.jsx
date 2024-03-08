import React, { useState } from "react";
import { useStateContext } from "../context";
import toast, { Toaster } from "react-hot-toast";
import { calculateRemainingTime } from "../utils/index";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const TicketMoreMenu = ({ event, ticket }) => {
  const { resellTicket, getBackResellTicket, address } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const notifyEventExpired = () => toast.error("Event expired!");
  const notifyUnAuthorized = () => toast.error("Unauthorized entity");
  const notifyAlreadyResell = () => toast.error("Ticket already resell!");
  const notifyNotResell = () => toast.error("Ticket not resell!");

  const callResellTicket = async () => {
    if (address == ticket.owner) {
      if (calculateRemainingTime(event.startsAt) != "Expired") {
        if (!ticket.reselled) {
          setIsLoading(true);
          const response = await resellTicket(event.id, ticket.id, address);
          setIsLoading(false);
          if (response) navigate("/event/" + event.id);
        } else {
          notifyAlreadyResell();
        }
      } else {
        notifyEventExpired();
      }
    } else {
      notifyUnAuthorized();
    }
  };

  const callGetBackFromResellTicket = async () => {
    if (address == ticket.owner) {
      if (ticket.reselled) {
        setIsLoading(true);
        const response = await getBackResellTicket(
          event.id,
          ticket.id,
          address
        );
        setIsLoading(false);
        if (response) navigate("/event/" + event.id);
      } else {
        notifyNotResell();
      }
    } else {
      notifyUnAuthorized();
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col absolute w-[100px] p-[15px] bg-white border-spacing-1 mt-5 border border-gray">
        <ul className="flex flex-col gap-4 text-[12px]">
          {ticket.reselled ? (
            <li
              onClick={callGetBackFromResellTicket}
              className="border-b cursor-pointer"
            >
              Get Back From Resell
            </li>
          ) : (
            <li onClick={callResellTicket} className="border-b cursor-pointer">
              Resell
            </li>
          )}
        </ul>
        <Toaster position="bottom-right" />
      </div>
    </>
  );
};

export default TicketMoreMenu;
