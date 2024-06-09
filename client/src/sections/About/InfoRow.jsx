import React from "react";
import { Eye, ChartCircle, Key, PresentionChart } from "iconsax-react";

const InfoRow = () => {
  return (
    <section className="bg-white mt-[4rem] pb-10">
      <div className="flex flex-col md:flex-row mx-auto items-center justify-center max-w-7xl px-4 gap-4 md:gap-6">
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[13.3rem] md:min-w-0 items-center justify-center md:justify-start">
          <Eye size={19} /> VISION
        </div>
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[13.3rem] md:min-w-0 items-center justify-center md:justify-start">
          <ChartCircle size={19} /> MISSION
        </div>
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[13.3rem] md:min-w-0 items-center justify-center md:justify-start">
          <Key size={19} /> VALUE
        </div>
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[13.3rem] md:min-w-0 items-center justify-center md:justify-start">
          <PresentionChart size={19} /> HISTORY
        </div>
      </div>
    </section>
  );
};

export default InfoRow;
