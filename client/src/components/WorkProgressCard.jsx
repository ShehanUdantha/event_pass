import React from "react";

const WorkProgressCard = ({ icon, title, description }) => {
  return (
    <div className="max-w-md w-full h-full mx-auto z-10 rounded-3xl transition-all duration-500 hover:scale-105">
      <div className="bg-white relative drop-shadow-xl rounded-3xl p-4 m-4 overflow-clip flex flex-col justify-center items-center">
        <div className="bg-[#6366f1] text-white text-3xl my-5 flex items-center justify-center w-[4.8rem] h-[4.8rem] rounded-full">
          {icon}
        </div>
        <h3 className="font-bold text-[20px] leading-none tracking-tight mb-6 text-black">
          {title}
        </h3>
        <p className="max-w-sm text-[1rem] leading-5 text-gray-light/80 tracking-tight mb-6 text-center text-black">
          {description}
        </p>
      </div>
    </div>
  );
};

export default WorkProgressCard;
