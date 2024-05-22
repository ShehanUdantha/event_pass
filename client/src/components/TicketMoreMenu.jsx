import React from "react";
import { useStateContext } from "../context";
import toast, { Toaster } from "react-hot-toast";
import { calculateRemainingTime } from "../utils/index";
import { Link, useNavigate } from "react-router-dom";
import { openSeaUrl } from "../constants/index";

const TicketMoreMenu = ({ event, ticket, onLoading }) => {
  const { address, resellOrUnsellTicket, requestOrCancelRefundTicket } =
    useStateContext();

  const navigate = useNavigate();

  const notifyEventExpired = () => toast.error("Event expired!");
  const notifyUnAuthorized = () => toast.error("Unauthorized entity");
  const notifyAlreadyResell = () => toast.error("Ticket already resell!");
  const notifyAlreadyRefunded = () => toast.error("Ticket already refunded!");
  const notifyAlreadyVerified = () => toast.error("Ticket already verified!");

  const callResellOrUnsellTicket = async (status) => {
    if (address == ticket.owner) {
      if (calculateRemainingTime(event.startsAt) != "Expired") {
        if (!ticket.verified) {
          if (!ticket.reselled || status === false) {
            onLoading(true);
            const response = await resellOrUnsellTicket(
              event.id,
              ticket.id,
              address,
              status
            );
            onLoading(false);
            if (response) {
              if (status) {
                navigate("/event/" + event.id);
              } else {
                window.location.reload(false);
              }
            }
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

  const callRequestOrCancelRefundTicket = async (status) => {
    if (address == ticket.owner) {
      if (!ticket.refunded) {
        onLoading(true);
        const response = await requestOrCancelRefundTicket(
          event.id,
          ticket.id,
          status
        );
        window.location.reload(false);
        onLoading(false);
      } else {
        notifyAlreadyRefunded();
      }
    } else {
      notifyUnAuthorized();
    }
  };

  return (
    <>
      <div className="flex flex-col absolute w-[100px] bg-white border-spacing-1 mt-2 border border-gray right-[1.5rem]">
        <ul className="flex flex-col text-[12px]">
          {ticket.reselled ? (
            <div
              onClick={() => callResellOrUnsellTicket(false)}
              className="border-b cursor-pointer p-2 flex justify-center items-center bg-white hover:bg-gray-100"
            >
              <li>UnSell</li>
            </div>
          ) : (
            <div
              onClick={() => callResellOrUnsellTicket(true)}
              className="border-b cursor-pointer p-2 flex justify-center items-center bg-white hover:bg-gray-100"
            >
              <li>Resell</li>
            </div>
          )}

          {ticket.isWaitingForRefund ? (
            <div
              onClick={() => callRequestOrCancelRefundTicket(false)}
              className="border-b cursor-pointer p-2 flex justify-center items-center bg-white hover:bg-gray-100"
            >
              <li>Cancel</li>
            </div>
          ) : (
            <div
              onClick={() => callRequestOrCancelRefundTicket(true)}
              className="border-b cursor-pointer p-2 flex justify-center items-center bg-white hover:bg-gray-100"
            >
              <li>Req Refund</li>
            </div>
          )}

          <Link key={ticket.id} to={ticket.qrCode}>
            <div className="border-b cursor-pointer p-2 flex justify-center items-center bg-white hover:bg-gray-100">
              <li>View Info</li>
            </div>
          </Link>

          <Link
            key={ticket.tokenId}
            to={openSeaUrl + ticket.tokenId}
            target="_blank"
          >
            <div className="border-b cursor-pointer p-2 flex justify-center items-center bg-white hover:bg-gray-100">
              <li>View NFT</li>
            </div>
          </Link>
        </ul>
        <Toaster position="bottom-center" />
      </div>
    </>
  );
};

export default TicketMoreMenu;
