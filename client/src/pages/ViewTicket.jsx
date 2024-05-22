import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import { useStateContext } from "../context";
import Spinner from "../assets/images/spinning-dots.svg";
import TicketDetailsSection from "../sections/Ticket/TicketDetailsSection";
import PageNotFound from "./NotFound";

const ViewTicket = () => {
  const { ticketAddress, ticketEvent, id } = useParams();
  const { contract, address, getSingleTicket, getSingleEvent } =
    useStateContext();

  const [event, setEvent] = useState({});
  const [ticket, setTicket] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchTicket = async () => {
    setIsLoading(true);

    if (!isNaN(+id)) {
      const data = await getSingleTicket(ticketEvent, id);

      if (
        ticketAddress.trim().toLowerCase() === data.owner.trim().toLowerCase()
      ) {
        setTicket(data);
        fetchEvent(data.eventId);
      } else {
        setTicket({ id: -1 });
        setIsLoading(false);
      }
    } else {
      setTicket({ id: -1 });
      setIsLoading(false);
    }
  };

  const fetchEvent = async () => {
    setIsLoading(true);

    if (!isNaN(+ticketEvent)) {
      const data = await getSingleEvent(ticketEvent);
      // console.log(data);
      setEvent(data);
    } else {
      setEvent({ id: 0 });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (contract && id) fetchTicket();
  }, [contract, address]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center text-[14px] h-screen">
          <img
            src={Spinner}
            alt="spinner"
            className="w-[60px] h-[60px] object-contain"
          />
        </div>
      ) : (
        <>
          {ticket.id === -1 || event.id === 0 ? (
            <PageNotFound />
          ) : (
            <>
              {/* header section */}
              <Header title={"Ticket Details"} />
              {/* ticket details section */}
              <TicketDetailsSection event={event} ticket={ticket} />
            </>
          )}
        </>
      )}
    </>
  );
};

export default ViewTicket;
