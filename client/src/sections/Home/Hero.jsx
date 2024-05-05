import React from "react";
import HeroBg from "../../assets/images/heroBg.png";
import { IoPlay } from "react-icons/io5";

const Hero = ({ scrollToEvents, onCallBack }) => {
  return (
    <section className="bg-[#F6F8FD] pt-32">
      <div className="flex flex-col md:flex-row mx-auto items-center justify-between max-w-7xl px-4">
        {/* hero title and description */}
        <div className="text-center md:text-start">
          <span className="max-w-sm font-bold text-[32px] leading-none tracking-tight md:text-[54px]">
            Enhance, Secure <br />
            & Celebrate with <br />
            Our Guaranteed way.
          </span>
          <br />
          <div className="pt-5 justify-center md:justify-start">
            <span className="max-w-sm text-[1.1rem] leading-none text-gray-light/80 tracking-tight">
              Explore the limitless possibilities of event hosting with our
              platform,
              <br />
              where convenience meets celebration, and connections become
              <br />
              unforgettable moments.
            </span>
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-y-5 gap-x-10 text-white mt-8 justify-center md:justify-start mb-10 items-center">
            <button
              className=" bg-[#4338ca] px-6 py-2 max-h-[2.6rem] font-medium rounded hover:bg-[#6366f1] transition-all duration-200 ease-in"
              onClick={scrollToEvents}
            >
              Explore Now
            </button>

            <div className="flex items-center gap-2">
              <div
                className="relative flex justify-center items-center cursor-pointer transition-all duration-200 hover:scale-105"
                onClick={onCallBack}
              >
                <div className="flex animate-spin">
                  <div className="w-[1.45rem] h-[2.85rem] rounded-tl-full rounded-bl-full bg-[#6366f1]"></div>
                  <div className="w-[1.45rem] h-[2.85rem] rounded-tr-full rounded-br-full bg-[#F6F8FD]"></div>
                </div>
                <div className="absolute w-[2.6rem] h-[2.7rem] bg-white rounded-full flex justify-center items-center drop-shadow-md">
                  <IoPlay className="text-black" />
                </div>
              </div>
              <div className="text-black font-medium">Learn More</div>
            </div>
          </div>
        </div>
        {/* hero bg */}
        <div className="hidden md:block">
          <img src={HeroBg} alt="HeroBg" width={620} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
