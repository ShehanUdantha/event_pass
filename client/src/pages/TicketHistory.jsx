import React, { useEffect, useState } from "react";
import HeaderSection from "../sections/TicketHistory/HeaderSection";
import { useParams } from "react-router-dom";
import { useStateContext } from "../context";
import Spinner from "../assets/images/spinning-dots.svg";
import TicketHistoryListView from "../components/TicketHistoryListView";

const TicketHistory = () => {
  const { id } = useParams();
  const {
    contract,
    address,
    getSingleEvent,
    getAllTicketsByEvent,
    getEventTicketHistory,
    getContractOwner,
  } = useStateContext();
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState({});
  const [ticketHistory, setTicketHistory] = useState([]);
  const [contractOwner, setContractOwner] = useState("");

  const fetchEvent = async (contractData) => {
    setIsLoading(true);

    if (!isNaN(+id)) {
      console.log("called0");
      const data = await getSingleEvent(id);
      setEvent(data);
      setIsLoading(false);
      if (data.owner == address || contractData == address) fetchTickets();
    } else {
      setEvent({ id: 0 });
      setIsLoading(false);
    }
  };

  const fetchTickets = async () => {
    setIsLoading(true);

    if (!isNaN(+id)) {
      console.log("called1");
      const data = await getAllTicketsByEvent(id);
      for (let x = 0; x < data.length; x++) {
        console.log("ticket data" + data[x].id);
      }
      setIsLoading(false);
      fetchTicketHistory(data);
    } else {
      setIsLoading(false);
    }
  };

  const fetchTicketHistory = async (ticketsData) => {
    console.log("called");
    setIsLoading(true);
    console.log("ticket length" + ticketsData.length);

    for (let i = 0; i < ticketsData.length; i++) {
      console.log("ticket length:" + i);
      console.log("ticketid", ticketsData[i].id);
      const data = await getEventTicketHistory(id, ticketsData[i].id);
      console.log("data" + " " + data);
      setTicketHistory((prevHistory) => [
        ...prevHistory,
        { id: ticketsData[i].id, owners: data },
      ]);
    }
    setIsLoading(false);
  };
  console.log(ticketHistory.length);

  const callToGetContractOwner = async () => {
    setIsLoading(true);
    const data = await getContractOwner();
    setContractOwner(data);
    fetchEvent(data);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setTicketHistory([]);
    if (contract && id) {
      callToGetContractOwner();
    }
  }, [contract, address, id]);

  return (
    <>
      {/* header section */}
      <HeaderSection />
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
            <>
              {/* ticket details section */}
              {isLoading ? null : (
                <TicketHistoryListView ticketHistory={ticketHistory} />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default TicketHistory;
