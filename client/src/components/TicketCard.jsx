import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { formatDateAndTime } from "../utils/index";
import Spinner from "../assets/images/spinning-dots.svg";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import { MdMoreVert } from "react-icons/md";
import TicketMoreMenu from "./TicketMoreMenu";

const TicketCard = ({ ticket }) => {
  const { contract, address, getSingleEvent } = useStateContext();
  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [displayMoreMenu, setDisplayMoreMenu] = useState(false);

  const fetchEvent = async () => {
    setIsLoading(true);
    const data = await getSingleEvent(ticket.eventId);
    console.log(data);
    setEvent(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract && ticket.eventId) fetchEvent();
  }, [contract, address, ticket.eventId]);

  return (
    <div className="shadow-md rounded-[1rem] cursor-pointer w-full">
      {isLoading ? (
        <div className="flex justify-center items-center text-[14px] h-[20rem]">
          <img
            src={Spinner}
            alt="spinner"
            className="w-[60px] h-[60px] object-contain"
          />
        </div>
      ) : (
        <Link key={ticket.id} to={ticket.qrCode}>
          <div className="flex justify-end pl-5 pt-3">
            <MdMoreVert
              onClick={() => setDisplayMoreMenu(!displayMoreMenu)}
              className="cursor-pointer text-lg"
            />
            {displayMoreMenu ? (
              <TicketMoreMenu eventId={event.id} ticket={ticket} />
            ) : null}
          </div>
          <div className="flex justify-center">
            <QRCode className="w-[150px] h-[100px]" value={ticket.qrCode} />
          </div>
          <div className="p-5 pt-2">
            <div className="overflow-hidden">
              <div className="font-bold text-md md:text-lg text-ellipsis overflow-hidden">
                {event.title}
              </div>
              <div className="flex items-center mt-2">
                <div className="p-1 bg-green-100 text-green-500 font-bold text-[12px] rounded-md mr-2">
                  ETH {event.ticketCost}
                </div>
                <div className="p-1 bg-gray-100 text-gray-500 font-bold text-[12px] rounded-md">
                  {event.category}
                </div>
              </div>
              <div className="text-[13px] text-gray-500 font-medium mt-1">
                {formatDateAndTime(event.startsAt)}
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default TicketCard;
