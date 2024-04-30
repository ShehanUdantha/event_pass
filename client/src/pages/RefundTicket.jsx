import React, { useState, useEffect } from "react";
import HeaderSection from "../sections/RefundTicket/HeaderSection";
import RefundTicketSection from "../sections/RefundTicket/RefundTicketSection";
import { useParams } from "react-router-dom";
import { useStateContext } from "../context";
import Spinner from "../assets/images/spinning-dots.svg";

const RefundTicket = () => {
  const { id } = useParams();

  const {
    contract,
    address,
    getSingleEvent,
    getAllTicketsByEvent,
    getContractOwner,
  } = useStateContext();
  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [contractOwner, setContractOwner] = useState("");

  const fetchEvent = async () => {
    setIsLoading(true);

    if (!isNaN(+id)) {
      const data = await getSingleEvent(id);
      // console.log(data);
      setEvent(data);
      fetchTicketsByEventId();
    } else {
      setEvent({ id: 0 });
      setIsLoading(false);
    }
  };

  const fetchTicketsByEventId = async () => {
    setIsLoading(true);

    const data = await getAllTicketsByEvent(id);
    // console.log(data);
    let filteredTickets = data.filter((ticket, i) => {
      return !ticket.refunded && ticket.isWaitingForRefund;
    });
    // console.log(filteredTickets.length);
    setTickets(filteredTickets);
    setIsLoading(false);
  };

  const callToGetContractOwner = async () => {
    setIsLoading(true);
    const data = await getContractOwner();
    setContractOwner(data);
    fetchEvent();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (contract && id) {
      callToGetContractOwner();
    }
  }, [contract, address]);

  return (
    <div>
      {/* header section */}
      <HeaderSection />
      {/* refund ticket section */}
      {isLoading ? (
        <div className="flex justify-center items-center text-[14px] h-[50svh]">
          <img
            src={Spinner}
            alt="spinner"
            className="w-[60px] h-[60px] object-contain"
          />
        </div>
      ) : (
        <>
          {event.id === 0 ||
          (address != contractOwner ? event.owner != address : false) ? (
            <div className="flex justify-center items-center text-[14px] h-[50svh]">
              <div className="text-3xl font-bold">Page Not Found</div>
            </div>
          ) : (
            <RefundTicketSection waitingTickets={tickets} />
          )}
        </>
      )}
    </div>
  );
};

export default RefundTicket;
