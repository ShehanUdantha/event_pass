import React, { useState } from "react";
import Search from "../../components/Search";
import { eventCategoryList } from "../../constants/index";

const FilterSection = () => {
  const [filteredCategory, setFilteredCategory] = useState();
  const [categoryList, setCategoryList] = useState([
    "All",
    ...eventCategoryList,
  ]);

  const handleChange = (e) => {
    setFilteredCategory(e.target.value);
  };

  return (
    <section className="mt-10 md:mt-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* section title */}
        <h2 className="font-bold text-[26px] leading-none tracking-tight">
          All Events
        </h2>

        {/* search and filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-8 md:gap-56">
          {/* search */}
          <Search />
          {/* filter */}
          <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2 mt-3 md:mt-0">
            <select
              className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
              name="category"
              value={filteredCategory}
              onChange={handleChange}
            >
              {categoryList.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
