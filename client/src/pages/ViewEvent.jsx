import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { calculateRemainingDays, formatDateAndTime } from "../utils/index";
import Footer from "../components/Footer";

const ViewEvent = () => {
  const location = useLocation();
  const [remainingDays, setRemainingDays] = useState(0);
  const event = location.state.eventDetails;

  useEffect(() => {
    setRemainingDays(calculateRemainingDays(event.startsAt));
  }, []);

  return (
    <>
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
                {remainingDays > 0 ? remainingDays : 0} day's remaining
              </div>
              <div className="text-[14px] text-[#b8b6b6] font-medium">
                {event.ticketRemain} ticket's left
              </div>
            </div>
            {/* event ticket price and event owner */}
            <div className="flex flex-row items-center mt-3">
              <div className="p-1 bg-green-100 text-green-500 font-bold text-[12px] rounded-md mr-2">
                ETH {event.ticketCost}
              </div>
              <div className="p-1 bg-gray-100 text-gray-500 font-bold text-[12px] rounded-md">
                {event.category}
              </div>
            </div>
            {/* owner details */}
            <div className="w-full text-[14px] text-gray-500 font-medium mt-2 text-ellipsis overflow-hidden">
              by {event.owner}
            </div>
            {/* buy ticket button */}
            <button className="bg-[#4338ca] text-white px-6 py-2 font-medium rounded hover:bg-[#6366f1] transition-all duration-200 ease-in mt-5">
              Get Ticket
            </button>
            {/* event time */}
            <div className="flex flex-col md:flex-row items-start md:items-center mt-5 justify-start">
              <div className="flex flex-row">
                <div className="text-[14px] font-medium mr-1">Started at:</div>
                <div className="text-[14px] mr-0 md:mr-10">
                  {formatDateAndTime(event.startsAt)}
                </div>
              </div>
              <div className="flex flex-row mt-[0.2rem] md:mt-0">
                <div className="text-[14px] font-medium mr-1">Ended at:</div>
                <div className="text-[14px]">
                  {formatDateAndTime(event.startsAt)}
                </div>
              </div>
            </div>
            {/* location */}
            <div className="flex flex-row items-center mt-2">
              <div className="text-[14px] font-medium mr-1">Venue:</div>
              <div className="text-[14px] mr-0 md:mr-10">{event.location}</div>
            </div>
            {/* event description */}
            <div className="text-[14px] max-h-[10rem] text-ellipsis overflow-hidden leading-tight mt-5 mb-10 md:mb-0">
              {event.description}
            </div>
          </div>
        </div>
      </div>
      {/* footer */}
      {/* <Footer /> */}
    </>
  );
};

export default ViewEvent;
