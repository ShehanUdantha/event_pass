import React from "react";
import { OurMissionImage } from "../../constants";

const OurMissionSection = () => {
  return (
    <section className="bg-white pb-[4rem] px-5 md:px-0">
      <div className="max-w-4xl h-[45rem] md:h-[28rem] bg-slate-50 rounded-3xl overflow-hidden mx-auto flex flex-col-reverse md:flex-row gap-1 justify-center items-center">
        <div className="w-full h-full">
          <div className="p-14 h-full w-full">
            <div
              className="bg-cover bg-center h-full w-full min-h-[15.5rem] rounded-[1.5rem]"
              style={{
                backgroundImage: `url(${OurMissionImage})`,
              }}
            />
          </div>
        </div>
        <div className="w-full h-full p-12 md:p-14">
          <span className="max-w-sm font-semibold text-[25px] leading-none tracking-tight md:text-[38px]">
            Our Mission
          </span>
          <div className="pt-5 justify-center md:justify-start">
            <span className="max-w-sm text-[1.01rem] font-normal leading-none tracking-tight text-gray-500">
              At the heart of EventPass lies a simple yet powerful mission: to
              become the cornerstone platform for experiences. We strive to add
              long-term value to our clients while making a positive impact on
              our planet.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMissionSection;
