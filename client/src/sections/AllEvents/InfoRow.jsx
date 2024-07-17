import React from "react";
import { MusicCircle, Flag, Dribbble, BookSaved } from "iconsax-react";

const InfoRow = () => {
  return (
    <section className="bg-white mt-5 pb-10">
      <div className="flex flex-col md:flex-row mx-auto items-center justify-center max-w-7xl px-4 gap-4 md:gap-6">
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[13.3rem] md:min-w-0 items-center justify-center md:justify-start">
          <MusicCircle size={19} /> CONCERTS
        </div>
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[13.3rem] md:min-w-0 items-center justify-center md:justify-start">
          <Dribbble size={19} /> SPORTS
        </div>
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[13.3rem] md:min-w-0 items-center justify-center md:justify-start">
          <Flag size={19} /> FESTIVALS
        </div>
        <div className="border p-2 rounded-lg text-[14px] font-normal flex gap-2 min-w-[13.3rem] md:min-w-0 items-center justify-center md:justify-start">
          <BookSaved size={19} /> EXPO
        </div>
      </div>
    </section>
  );
};

export default InfoRow;
