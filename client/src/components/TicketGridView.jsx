import React from "react";
import Spinner from "../assets/images/spinning-dots.svg";
import TicketCard from "./TicketCard";

const TicketGridView = ({ tickets, isLoading, isSecondary }) => {
  const fetchedTickets = tickets;
  return (
    <section className="mt-10 md:mt-10">
      {isLoading ? (
        <div className="flex justify-center items-center text-[14px] h-[20rem]">
          <img
            src={Spinner}
            alt="spinner"
            className="w-[60px] h-[60px] object-contain"
          />
        </div>
      ) : fetchedTickets != null && fetchedTickets.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-4 grid-cols-1 gap-8">
          {fetchedTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isSecondary={isSecondary}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center text-[14px] h-[20rem]">
          No Any Tickets Found!
        </div>
      )}
    </section>
  );
};

export default TicketGridView;
