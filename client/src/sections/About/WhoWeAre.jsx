import React from "react";
import { WhoWeAreImage } from "../../constants";

const WhoWeAre = () => {
  return (
    <section className="mt-10 bg-white py-[4rem] px-5 md:px-0">
      <div className="max-w-4xl h-[50rem] md:h-[28rem] bg-slate-50 rounded-3xl overflow-hidden mx-auto flex flex-col-reverse md:flex-row gap-1 justify-center items-center">
        <div className="w-full h-full p-12 md:p-14">
          <span className="max-w-sm font-semibold text-[25px] leading-none tracking-tight md:text-[38px]">
            Who We Are
          </span>
          <div className="pt-5 justify-center md:justify-start">
            <span className="max-w-sm text-[1.01rem] font-normal leading-none tracking-tight text-gray-500">
              EventPass is more than just a ticketing solution; we're a team of
              dedicated individuals committed to revolutionizing the event
              industry. With our self-service cloud software, we empower event
              organizers to effortlessly manage every aspect of their events,
              from selling tickets to engaging with customers.
            </span>
          </div>
        </div>
        <div className="w-full h-full">
          <div className="p-10 md:p-14 h-full w-full">
            <div
              className="bg-cover bg-center h-full w-full min-h-[15.5rem] rounded-[1.5rem]"
              style={{
                backgroundImage: `url(${WhoWeAreImage})`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
