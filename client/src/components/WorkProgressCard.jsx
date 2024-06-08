import React from "react";

const WorkProgressCard = ({ icon, title, description }) => {
  return (
    <div className="max-w-md w-full h-full mx-auto z-10 rounded-3xl transition-all duration-500 hover:scale-105">
      <div className="bg-white relative drop-shadow-xl rounded-3xl px-2 py-1 h-full overflow-clip flex flex-col justify-center items-center">
        <div className="bg-[#6366f1] text-white text-2xl my-5 flex items-center justify-center w-[4.3rem] h-[4.3rem] rounded-full">
          {icon}
        </div>
        <h3 className="font-semibold text-[19px] leading-none tracking-tight mb-6 text-black">
          {title}
        </h3>
        <p className="max-w-sm text-[15px] leading-5 text-gray-500 tracking-tight mb-6 text-center">
          {description}
        </p>
      </div>
    </div>
  );
};

export default WorkProgressCard;
