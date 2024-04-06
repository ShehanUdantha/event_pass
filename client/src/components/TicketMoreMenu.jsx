import React, { useState } from "react";
import { useStateContext } from "../context";
import toast, { Toaster } from "react-hot-toast";
import { calculateRemainingTime } from "../utils/index";
import Loader from "./Loader";
import { Link, useNavigate } from "react-router-dom";

const TicketMoreMenu = ({ event, ticket }) => {
  const {
    resellTicket,
    getBackResellTicket,
    address,
    requestRefundTicket,
    cancelRefundTicket,
  } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const notifyEventExpired = () => toast.error("Event expired!");
  const notifyUnAuthorized = () => toast.error("Unauthorized entity");
  const notifyAlreadyResell = () => toast.error("Ticket already resell!");
  const notifyNotResell = () => toast.error("Ticket not resell!");
  const notifyAlreadyRefunded = () => toast.error("Ticket already refunded!");
  const notifyAlreadyVerified = () => toast.error("Ticket already verified!");

  const callResellTicket = async () => {
    if (address == ticket.owner) {
      if (calculateRemainingTime(event.startsAt) != "Expired") {
        if (!ticket.verified) {
          if (!ticket.reselled) {
            setIsLoading(true);
            const response = await resellTicket(event.id, ticket.id, address);
            setIsLoading(false);
            if (response) navigate("/event/" + event.id);
          } else {
            notifyAlreadyResell();
          }
        } else {
          notifyAlreadyVerified();
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

  const callRequestRefundTicket = async () => {
    if (address == ticket.owner) {
      if (!ticket.refunded) {
        setIsLoading(true);
        const response = await requestRefundTicket(event.id, ticket.id);
        window.location.reload(false);
        setIsLoading(false);
      } else {
        notifyAlreadyRefunded();
      }
    } else {
      notifyUnAuthorized();
    }
  };

  const callCancelRefundTicket = async () => {
    if (address == ticket.owner) {
      if (!ticket.refunded) {
        setIsLoading(true);
        const response = await cancelRefundTicket(event.id, ticket.id);
        window.location.reload(false);
        setIsLoading(false);
      } else {
        notifyAlreadyRefunded();
      }
    } else {
      notifyUnAuthorized();
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col absolute w-[100px] bg-white border-spacing-1 mt-2 border border-gray right-[1.5rem]">
        <ul className="flex flex-col text-[12px]">
          {ticket.reselled ? (
            <div
              onClick={callGetBackFromResellTicket}
              className="border-b cursor-pointer p-2 flex justify-center items-center bg-white hover:bg-gray-100"
            >
              <li>Get Back</li>
            </div>
          ) : (
            <div
              onClick={callResellTicket}
              className="border-b cursor-pointer p-2 flex justify-center items-center bg-white hover:bg-gray-100"
            >
              <li>Resell</li>
            </div>
          )}

          {ticket.isWaitingForRefund ? (
            <div
              onClick={callCancelRefundTicket}
              className="border-b cursor-pointer p-2 flex justify-center items-center bg-white hover:bg-gray-100"
            >
              <li>Cancel</li>
            </div>
          ) : (
            <div
              onClick={callRequestRefundTicket}
              className="border-b cursor-pointer p-2 flex justify-center items-center bg-white hover:bg-gray-100"
            >
              <li>Req Refund</li>
            </div>
          )}

          <Link key={ticket.id} to={ticket.qrCode}>
            <div className="border-b cursor-pointer p-2 flex justify-center items-center bg-white hover:bg-gray-100">
              <li>View</li>
            </div>
          </Link>
        </ul>
        <Toaster position="bottom-right" />
      </div>
    </>
  );
};

export default TicketMoreMenu;
