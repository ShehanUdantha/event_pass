import React from "react";
import HeroBg from "../../assets/images/heroBg.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-[#F6F8FD] pt-32">
      <div className="flex flex-col md:flex-row mx-auto items-center justify-between max-w-7xl px-4">
        {/* hero title and description */}
        <div className="text-center md:text-start">
          <span className="max-w-sm font-bold text-[32px] leading-none tracking-tight md:text-[54px]">
            Host, Connect, <br />
            Celebrate Your Events, <br />
            Our Platform
          </span>
          <br />
          <div className="pt-5 justify-center md:justify-start">
            <span className="max-w-sm text-5xl lg:text-7xl text-gray-light/80 tracking-tight">
              Explore the limitless possibilities of event hosting with our
              platform,
              <br />
              where convenience meets celebration, and connections become
              <br />
              unforgettable moments.
            </span>
          </div>
          <div className="flex text-white pt-4 justify-center md:justify-start mb-10">
            <Link to="/">
              <button className=" bg-[#4338ca] px-6 py-2 font-medium rounded hover:bg-[#6366f1] transition-all duration-200 ease-in">
                Explore Now
              </button>
            </Link>
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
