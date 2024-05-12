import React, { useState } from "react";

const ToolTip = ({ message, children }) => {
  const [isVisible, setVisible] = useState(false);
  return (
    <div
      className="relative"
      onMouseOver={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {isVisible && message !== "" ? (
        <div className="absolute top-12 z-8 w-[140px] flex items-center justify-center text-[13px] rounded-md px-1 py-2 bg-[#f0f0f0] text-black dark:bg-white/90 ">
          {message}
        </div>
      ) : null}
    </div>
  );
};

export default ToolTip;
