import React from "react";
import Search from "../components/Search";
const FilterSection = () => {
  return (
    <section className="mt-10 md:mt-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* section title */}
        <h2 className="font-bold text-[26px] leading-none tracking-tight">
          All Events
        </h2>

        {/* search and filters */}
        <div className="flex items-center justify-between mt-8 gap-56">
          <Search />
          {/* <div>filter</div> */}
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
