import React from "react";

const Hero = ({ scrollToEvents }) => {
  return (
    <section className="bg-white pt-32">
      <div className="flex flex-col md:flex-row mx-auto items-center justify-center max-w-7xl px-4">
        {/* hero title and description */}
        <div className="text-center md:text-center mt-[3rem]">
          <span className="max-w-m font-semibold text-[32px] leading-none tracking-tight md:text-[67px]">
            Learn About Who We Are <br />
            and What We Do.
          </span>
          <br />
          <div className="pt-5 justify-center md:justify-start mt-2">
            <span className="max-w-sm text-[1.2rem] leading-none text-gray-500 text-medium tracking-tight">
              Experiences Redefined. Partnerships Forged.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
