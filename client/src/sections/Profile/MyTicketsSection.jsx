import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context";
import TicketGridView from "../../components/TicketGridView";

const MyTicketsSection = () => {
  const { contract, address, getMyTickets } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    setIsLoading(true);
    const data = await getMyTickets();
    setTickets(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract && address) {
      fetchTickets();
    } else {
      setTickets([]);
    }
  }, [contract, address]);

  return (
    <>
      <TicketGridView tickets={tickets} isLoading={isLoading} />
    </>
  );
};

export default MyTicketsSection;
