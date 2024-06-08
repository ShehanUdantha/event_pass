import React from "react";
import HeroBg from "../../assets/images/heroBg.png";
import { IoPlay } from "react-icons/io5";

const Hero = ({ scrollToEvents, onCallBack }) => {
  return (
    <section className="bg-white pt-32">
      <div className="flex flex-col md:flex-row mx-auto items-center justify-center max-w-7xl px-4">
        {/* hero title and description */}
        <div className="text-center md:text-center mt-[3rem]">
          <span className="max-w-sm font-semibold text-[32px] leading-none tracking-tight md:text-[67px]">
            Decentralized Event Ticketing <br /> & Managing Solution.
          </span>
          <br />
          <div className="pt-5 justify-center md:justify-start mt-2">
            <span className="max-w-sm text-[1.2rem] leading-none text-gray-500 text-medium tracking-tight">
              {/* Explore the limitless possibilities of event hosting with our
              platform,
              <br />
              where convenience meets celebration, and connections become
              <br />
              unforgettable moments. */}
              Events Simplified. Transparency Unified.
            </span>
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-y-5 gap-x-10 text-white mt-10 justify-center md:justify-center mb-10 items-center">
            {/* <button
              className=" bg-[#4338ca] px-6 py-2 max-h-[2.6rem] font-medium rounded hover:bg-[#6366f1] transition-all duration-200 ease-in"
              onClick={scrollToEvents}
            >
              Explore Now
            </button> */}

            <div className="w-[10rem] h-[3rem] border rounded-3xl flex justify-center items-center cursor-pointer text-white bg-[#4338ca] hover:bg-[#6366f1] transition hover:-translate-y-1 hover:scale-105 duration-900">
              <span className="text-[1.01rem] font-semibold">View Events</span>
            </div>

            {/* <div className="flex items-center gap-2">
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
            </div> */}
          </div>
        </div>
        {/* hero bg */}
        {/* <div className="hidden md:block">
          <img src={HeroBg} alt="HeroBg" width={620} />
        </div> */}
      </div>
    </section>
  );
};

export default Hero;
