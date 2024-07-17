import React from "react";
import { useStateContext } from "../../context";
import { Link } from "react-router-dom";

const Hero = ({ scrollToEvents }) => {
  const { address } = useStateContext();

  return (
    <section className="bg-white pt-32">
      <div className="flex flex-col md:flex-row mx-auto items-center justify-center max-w-7xl px-4">
        {/* hero title and description */}
        <div className="text-center md:text-center mt-[3rem]">
          <span className="max-w-m font-semibold text-[32px] leading-none tracking-tight md:text-[67px]">
            Discover All the <br />
            Exciting Happenings.
          </span>
          <br />

          <div className="flex flex-col-reverse md:flex-row gap-y-5 gap-x-10 text-white mt-10 justify-center md:justify-center mb-10 items-center">
            <div className="w-[10rem] h-[3rem] border rounded-3xl flex justify-center items-center cursor-pointer text-white bg-[#4338ca] hover:bg-[#6366f1] transition hover:-translate-y-1 hover:scale-105 duration-900">
              <span
                className="text-[1.01rem] font-semibold"
                onClick={scrollToEvents}
              >
                Explore Now
              </span>
            </div>
            {address == undefined ? null : (
              <Link
                key={"create-event"}
                to={"/create-event/"}
                className="w-[10rem] h-[3rem] border rounded-3xl flex justify-center items-center cursor-pointer text-black hover:text-white bg-white hover:bg-[#6366f1] transition hover:-translate-y-1 hover:scale-105 duration-900"
              >
                <span className="text-[1.01rem] font-semibold">
                  Create an Event
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
