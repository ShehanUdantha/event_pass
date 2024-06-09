import React from "react";
import { WhyWeDoItImage } from "../../constants";

const WhyWeDoItSection = () => {
  return (
    <section className="bg-white pb-[4rem] px-5 md:px-0">
      <div className="max-w-4xl h-[60rem] md:h-[28rem] bg-slate-50 rounded-3xl overflow-hidden mx-auto flex flex-col-reverse md:flex-row gap-1 justify-center items-center">
        <div className="w-full h-full p-12 md:p-14">
          <span className="max-w-sm font-semibold text-[25px] leading-none tracking-tight md:text-[38px]">
            Why We Do It?
          </span>
          <div className="pt-5 justify-center md:justify-start">
            <span className="max-w-sm text-[1.01rem] font-normal leading-none tracking-tight text-gray-500">
              We believe in redefining the ticketing experience. Our goal is to
              create an elegantly designed, stress-free, fair, and ethical
              platform. We prioritize long-term impact over short-term gains,
              focusing on the sustainable growth of our clients' events and our
              environment.
            </span>
            <br />
            <br />
            <span className="max-w-sm text-[1.01rem] font-normal leading-none tracking-tight text-gray-500">
              With EventPass, you're not just choosing a ticketing platform;
              you're joining a movement towards better events, better
              experiences, and a better world. Let's create something
              extraordinary, together.
            </span>
          </div>
        </div>
        <div className="w-full h-full">
          <div className="p-14 h-full w-full">
            <div
              className="bg-cover bg-center h-full w-full min-h-[15.5rem] rounded-[1.5rem]"
              style={{
                backgroundImage: `url(${WhyWeDoItImage})`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWeDoItSection;
