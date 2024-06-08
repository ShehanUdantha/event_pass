import React from "react";
import SellingTickets from "../../assets/images/sellTicket.jpg";

const StartEventSection = () => {
  return (
    <section className="bg-white py-[4rem] px-5 md:px-0">
      <div className="max-w-4xl h-[50rem] md:h-[33rem] overflow-hidden mx-auto flex flex-col md:flex-row gap-1 justify-center items-center">
        <div className="w-full h-full">
          <div className="w-full h-full bg-slate-50 rounded-3xl">
            <img
              src={SellingTickets}
              alt="sellingTickets"
              className="p-14 h-full w-full object-cover rounded-[5rem]"
            />
          </div>
        </div>
        <div className="w-full h-full p-12 md:p-14 ">
          <span className="max-w-sm font-semibold text-[25px] leading-none tracking-tight md:text-[38px]">
            Already Selling Tickets Online?
          </span>
          <div className="pt-5 justify-center md:justify-start">
            <span className="max-w-sm text-[1.01rem] font-normal leading-none tracking-tight text-gray-500">
              Already a seasoned player in the online ticketing world? Think of
              EventPass as your dynamic sidekick. Integrate our platform
              alongside your existing solutions, and tap into a fresh audience
              eager for events. With us, you're not just diversifying; you're
              amplifying your reach, securing more sales, and leaving no ticket
              unsold.
            </span>
          </div>

          <div className="mt-[3rem] w-[10rem] h-[3rem] border rounded-3xl flex justify-center items-center cursor-pointer bg-[#4338ca] text-white">
            <span className="text-[1.01rem] font-semibold">
              Create New Event
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartEventSection;
