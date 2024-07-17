import React from "react";
import { Slash, MagicStar, SecuritySafe, DollarCircle } from "iconsax-react";

const InfoRow = () => {
  return (
    <section className="bg-white mt-5 pb-10">
      <div className="flex flex-col md:flex-row mx-auto items-center justify-center max-w-7xl px-4 gap-4 md:gap-6">
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[14.2rem] md:min-w-0 items-center justify-center md:justify-start">
          <MagicStar size={19} /> 4.9 CUSTOMER RATING
        </div>
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[14.2rem] md:min-w-0 items-center justify-center md:justify-start">
          <Slash size={19} /> COMPLETELY FREE
        </div>
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[14.2rem] md:min-w-0 items-center justify-center md:justify-start">
          <DollarCircle size={19} /> START SELLING INSTANTLY
        </div>
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[14rem] md:min-w-0 items-center justify-center md:justify-start">
          <SecuritySafe size={19} /> GUARANTEED 100% PRIVACY
        </div>
      </div>
    </section>
  );
};

export default InfoRow;
