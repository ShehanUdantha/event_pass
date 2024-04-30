import React, { useState, useEffect } from "react";
import TicketGridView from "../../components/TicketGridView";
import { useStateContext } from "../../context";

const SecondaryMarketSection = ({ eventId, onLoading }) => {
  const { contract, address, getResellTicketsByEventId } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    setIsLoading(true);
    if (!isNaN(+eventId)) {
      const data = await getResellTicketsByEventId(eventId);
      setTickets(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contract && eventId) {
      fetchTickets();
    } else {
      setTickets([]);
    }
  }, [contract, address]);

  return (
    <>
      {tickets.length > 0 ? (
        <section className="pt-10 pb-16 h-screen">
          <div className="mx-auto max-w-7xl px-4">
            {/* section title */}
            <h2 className="font-bold text-[26px] leading-none tracking-tight">
              Secondary Market
            </h2>
            {/* tickets grid view */}
            <div className="w-full">
              <TicketGridView
                tickets={tickets}
                isLoading={isLoading}
                isSecondary={true}
                onLoading={onLoading}
              />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default SecondaryMarketSection;
