import React from "react";

const TitleSection = ({ title }) => {
  return (
    <section className="bg-white mt-[3rem] pb-8">
      <div className="flex flex-col md:flex-row mx-auto items-center justify-center max-w-4xl px-4 gap-4 md:gap-6">
        <span className=" text-center font-medium text-[28px] tracking-tight md:text-[45px]">
          {title}
        </span>
      </div>
    </section>
  );
};

export default TitleSection;
