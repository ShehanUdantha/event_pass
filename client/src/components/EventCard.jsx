import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <Link
      className="shadow-md rounded-[1rem] cursor-pointer w-full"
      key={event.id}
    >
      <div>
        <img
          src={event.imageUrl}
          alt=""
          className="w-full rounded-t-[1rem] md:h-[15rem]"
        />
      </div>

      <div className="p-5">
        <div className="overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="font-bold text-lg">{event.title}</div>
            <div className="p-1 bg-green-100 text-green-500 font-bold text-[12px] rounded-md">
              ETH {event.ticketCost}
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="text-[14px] text-gray-500 font-medium">
              Started at: {event.startsAt}
            </div>
            <div className="text-[14px] text-gray-500 font-medium">
              Ended at: {event.endsAt}
            </div>
          </div>
          <div className="text-[14px] max-h-10 overflow-hidden leading-tight mt-1">
            {event.description}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
