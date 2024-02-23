import React from "react";
import { Link } from "react-router-dom";

const GridViewSection = ({ events }) => {
  const fetchedEvents = events;

  return (
    <section className="mt-10 md:mt-10">
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-3 sm:grid-cols-3 grid-cols-1 gap-8">
        {fetchedEvents.map((event) => (
          <Link
            className="shadow-md rounded-[1rem] cursor-pointer"
            key={event.id}
          >
            <div>
              <img
                src={event.imageUrl}
                alt=""
                className="w-full rounded-t-[1rem] md:h-[15rem]"
              />
            </div>

            <div className="p-5 ">
              <div className="flex items-center justify-between">
                <div>{event.title}</div>
                <div>{event.ticketCost}</div>
              </div>
              <div>{event.description}</div>
              <div className="flex items-center justify-between">
                <div>{event.startsAt}</div>
                <div>{event.endsAt}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default GridViewSection;
