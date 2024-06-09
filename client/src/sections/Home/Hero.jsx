import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
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
              Events Simplified. Transparency Unified.
            </span>
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-y-5 gap-x-10 text-white mt-10 justify-center md:justify-center mb-10 items-center">
            <Link
              key={"home-hero-view"}
              to={"/events"}
              className="w-[10rem] h-[3rem] border rounded-3xl flex justify-center items-center cursor-pointer text-white bg-[#4338ca] hover:bg-[#6366f1] transition hover:-translate-y-1 hover:scale-105 duration-900"
            >
              <span className="text-[1.01rem] font-semibold">View Events</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
