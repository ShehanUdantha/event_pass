import React from "react";
import logo from "../assets/icons/logo-icon.png";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
        {/* logo */}
        <div className="flex items-center justify-center md:justify-start">
          <img src={logo} alt="logo" width={30} height={25} />
          <a href="/" className="font-bold text-xl pl-1">
            EventPass
          </a>
        </div>
        {/* description */}
        <p className="flex justify-center md:justify-start text-[16px] text-center">
          2024 EventPass. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
