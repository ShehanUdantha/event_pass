import React, { useEffect, useState } from "react";
import HeaderSection from "../sections/TicketHistory/HeaderSection";
import Footer from "../components/Footer";
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
  } = useStateContext();
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState({});
  const [ticketHistory, setTicketHistory] = useState([]);

  const fetchEvent = async () => {
    setIsLoading(true);

    if (!isNaN(+id)) {
      console.log("called0");
      const data = await getSingleEvent(id);
      setEvent(data);
      setIsLoading(false);
      if (data.owner == address) fetchTickets();
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

  useEffect(() => {
    setTicketHistory([]);
    if (contract && id) fetchEvent();
  }, [contract, address, id]);

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
          {event.id == 0 ? (
            <div className="flex justify-center items-center text-[14px] h-screen">
              <div className="text-3xl font-bold">Page Not Found</div>
            </div>
          ) : (
            <>
              {/* header section */}
              <HeaderSection />
              {/* ticket details section */}
              {isLoading ? null : (
                <TicketHistoryListView ticketHistory={ticketHistory} />
              )}
              {/* footer */}
              {/* <Footer /> */}
            </>
          )}
        </>
      )}
    </>
  );
};

export default TicketHistory;
