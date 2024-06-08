import React from "react";
import { Ticket, ArrangeVertical, Flashy, Map1 } from "iconsax-react";

const InfoRow = () => {
  return (
    <section className="bg-white mt-5 pb-10">
      <div className="flex flex-col md:flex-row mx-auto items-center justify-center max-w-7xl px-4 gap-4 md:gap-6">
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[13.3rem] md:min-w-0 items-center justify-center md:justify-start">
          <Ticket size={19} /> EVENTS
        </div>
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[13.3rem] md:min-w-0 items-center justify-center md:justify-start">
          <Flashy size={19} /> ACTIVITIES
        </div>
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[13.3rem] md:min-w-0 items-center justify-center md:justify-start">
          <ArrangeVertical size={19} /> ATTRACTIONS
        </div>
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[13.3rem] md:min-w-0 items-center justify-center md:justify-start">
          <Map1 size={19} /> TOURS
        </div>
      </div>
    </section>
  );
};

export default InfoRow;
