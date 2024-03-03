import React from "react";
import { Link } from "react-router-dom";
import { formatDateAndTime } from "../utils/index";

const EventCard = ({ event }) => {
  return (
    <Link
      className="shadow-md rounded-[1rem] cursor-pointer w-full"
      key={event.id}
      to={"/event/" + event.id}
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
            <div className="font-bold text-md md:text-lg text-ellipsis overflow-hidden md:w-3/5">
              {event.title}
            </div>
            <div className="flex items-center justify-end">
              <div className="p-1 bg-green-100 text-green-500 font-bold text-[12px] rounded-md mr-2">
                ETH {event.ticketCost}
              </div>
              <div className="p-1 bg-gray-100 text-gray-500 font-bold text-[12px] rounded-md">
                {event.category}
              </div>
            </div>
          </div>
          <div className="text-[13px] text-gray-500 font-medium mt-1">
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
