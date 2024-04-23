import React from "react";
import { Link } from "react-router-dom";
import { formatDateAndTime } from "../utils/index";

const EventCard = ({ event }) => {
  return (
    <Link
      className="shadow-md rounded-[1rem] cursor-pointer w-full transition-all duration-500 hover:scale-105"
      key={event.id}
      to={"/event/" + event.id}
    >
      <div>
        <img
          src={event.imageUrl}
          alt=""
          className="w-full rounded-t-[1rem] md:h-[11rem]"
        />
      </div>

      <div className="px-5 pb-3 mt-2">
        <div className="overflow-hidden">
          <div className="font-bold text-md md:text-[18px] md:leading-5 text-ellipsis overflow-hidden">
            {event.title}
          </div>

          <div className="flex items-center justify-start mt-2">
            <div className="p-1 bg-green-100 text-green-500 font-bold text-[10px] rounded-md mr-2">
              ETH {event.ticketCost}
            </div>
            <div className="p-1 bg-gray-100 text-gray-500 font-bold text-[10px] rounded-md">
              {event.category}
            </div>
          </div>

          <div className="text-[13px] text-gray-500 font-medium mt-2">
            {formatDateAndTime(event.startsAt)}
          </div>

          <div className="text-[13px] max-h-[2rem] text-ellipsis overflow-hidden leading-tight mt-[0.3rem]">
            {event.description}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
