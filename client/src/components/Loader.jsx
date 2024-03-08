import React from "react";
import Spinner from "../assets/images/spinning-dots.svg";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-30 h-screen bg-[#000000b3] backdrop-blur-sm flex items-center justify-center flex-col">
      <img
        src={Spinner}
        alt="spinner"
        className="w-[60px] h-[60px] object-contain"
      />
      <p className="mt-[20px] font-epilogue font-medium text-[16px] md:text-[18px] text-white text-center">
        Transaction is in progress <br /> Please wait...
      </p>
    </div>
  );
};

export default Loader;
