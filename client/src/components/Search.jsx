import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  if (searchInput.length > 0) {
    console.log(searchInput);
  }

  return (
    <div className="flex gap-3 min-h-[40px] md:w-2/5 overflow-hidden rounded-full bg-[#e7e9ec] px-4 py-2">
      <IoSearchOutline className="mt-1 text-gray-500" />
      <input
        className="bg-[#e7e9ec] border border-[#e7e9ec] w-full text-gray-900 focus:outline-none"
        type="search"
        placeholder="Search events"
        onChange={handleChange}
        value={searchInput}
      />
    </div>
  );
};

export default Search;
