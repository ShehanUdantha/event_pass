import React from "react";

const PaginationSection = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 my-10 flex items-center justify-center gap-6">
      <h4 className="font-medium text-gray-500 text-[14px] leading-none tracking-tight cursor-pointer">
        Previous
      </h4>
      <h4 className="font-medium text-[14px] leading-none tracking-tight cursor-pointer">
        Next
      </h4>
    </div>
  );
};

export default PaginationSection;
