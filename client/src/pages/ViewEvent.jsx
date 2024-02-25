import React from "react";
import { useLocation } from "react-router-dom";

const ViewEvent = () => {
  const location = useLocation();
  const event = location.state.eventDetails;
  return (
    <div className="bg-[#F6F8FD] pt-32 pb-16 h-screen">
      <div className="flex flex-col md:flex-row mx-auto items-center md:items-start justify-center md:justify-start gap-5 max-w-7xl px-4">
        {/* event image */}
        <div className="w-full">
          <img
            src={event.imageUrl}
            alt=""
            className="w-full rounded-lg md:h-[25rem]"
          />
        </div>
        {/* event text details */}
        <div className="w-full">
          {/* event title */}
          <h3 className="font-bold text-2xl md:text-3xl">{event.title}</h3>
          {/* event remaining and tickets left */}
          <div className="flex items-center mt-1 justify-between md:justify-start">
            <div className="text-[14px] text-[#b8b6b6] font-medium md:mr-10">
              1 day's remaining
            </div>
            <div className="text-[14px] text-[#b8b6b6] font-medium">
              50 ticket's left
            </div>
          </div>
          {/* event ticket price and event owner */}
          <div className="flex flex-col md:flex-row items-start md:items-center mt-3">
            <div className="p-1 bg-green-100 text-green-500 font-bold text-[12px] rounded-md md:mr-10 md:w-[56px]">
              ETH {event.ticketCost}
            </div>
            <div className="w-full text-[14px] text-gray-500 font-medium  text-ellipsis overflow-hidden">
              by {event.owner}
            </div>
          </div>
          {/* buy ticket button */}
          <button className="bg-[#4338ca] text-white px-6 py-2 font-medium rounded hover:bg-[#6366f1] transition-all duration-200 ease-in mt-5">
            Get Ticket
          </button>
          {/* event time */}
          <div className="flex items-center mt-5 justify-between md:justify-start">
            <div className="flex flex-col md:flex-row">
              <div className="text-[14px] font-medium mr-1">Started at:</div>
              <div className="text-[14px] font-medium mr-0 md:mr-10">
                {event.startsAt}
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="text-[14px] font-medium mr-1">Ended at:</div>
              <div className="text-[14px] font-medium">{event.startsAt}</div>
            </div>
          </div>
          {/* event description */}
          <div className="text-[14px] max-h-[10rem] text-ellipsis overflow-hidden leading-tight mt-5 mb-10 md:mb-0">
            {event.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEvent;
