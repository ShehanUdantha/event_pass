import React from "react";

const Header = ({ title }) => {
  return (
    <section className="bg-[#F6F8FD] pt-32 pb-16">
      <div className="flex mx-auto items-center justify-center md:justify-start max-w-7xl px-4">
        <h3 className="font-bold text-3xl">{title}</h3>
      </div>
    </section>
  );
};

export default Header;
