import React from "react";
import EventCard from "../../components/EventCard";

const GridViewSection = ({ events }) => {
  const fetchedEvents = events;

  return (
    <section className="mt-10 md:mt-10">
      {fetchedEvents != null && fetchedEvents.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-3 sm:grid-cols-3 grid-cols-1 gap-8">
          {fetchedEvents.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center text-[14px] h-[20rem]">
          No Any Events Found!
        </div>
      )}
    </section>
  );
};

export default GridViewSection;
