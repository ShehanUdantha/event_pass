import React, { useEffect, useState, useRef } from "react";
import Hero from "../sections/Home/Hero";
import GridView from "../components/EventGridView";
import PaginationSection from "../sections/Home/PaginationSection";
import { useStateContext } from "../context";
import { eventCategoryList } from "../constants/index";
import { IoSearchOutline } from "react-icons/io5";

const Home = () => {
  const { contract, address, getAllEvents } = useStateContext();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const eventsRef = useRef(null);

  const [searchInput, setSearchInput] = useState("");
  const [filteredCategory, setFilteredCategory] = useState();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categoryList, setCategoryList] = useState([
    "All",
    ...eventCategoryList,
  ]);

  const fetchEvents = async () => {
    setIsLoading(true);
    const data = await getAllEvents();
    setEvents(data);
    setFilteredEvents(data);
    setIsLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilteredCategory(e.target.value);
    filterEvents(e.target.value, searchInput);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    filterEvents(filteredCategory, e.target.value);
  };

  const filterEvents = (category, search) => {
    let filtered = events;

    if (category !== "All") {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (search) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (contract) fetchEvents();
  }, [contract, address]);

  console.log(events);

  const scrollToEvents = () => {
    eventsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      {/* hero section */}
      <Hero scrollToEvents={scrollToEvents} />
      {/* filter section */}
      <section className="mt-10 md:mb-14 md:mt-16">
        <div className="mx-auto max-w-7xl px-4">
          {/* section title */}
          <h2 className="font-bold text-[26px] leading-none tracking-tight">
            All Events
          </h2>

          {/* search and filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-8 md:gap-56">
            {/* search */}
            <div className="min-h-[40px] flex rounded-2xl w-full bg-[#F6F6F6] px-4 py-[7px] mt-3 md:mt-0">
              <IoSearchOutline className="mt-1 text-gray-500 mr-3" />
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6] w-full text-gray-900 focus:outline-none"
                type="search"
                placeholder="Search events"
                onChange={handleSearchChange}
                value={searchInput}
              />
            </div>
            {/* filter */}
            <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2 mt-3 md:mt-0 cursor-pointer">
              <select
                className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none cursor-pointer"
                name="category"
                value={filteredCategory}
                onChange={handleFilterChange}
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
      {/* grid view */}
      <section ref={eventsRef}>
        <GridView events={filteredEvents} isLoading={isLoading} />
      </section>
      {/* pagination section */}
      <PaginationSection />
    </div>
  );
};

export default Home;
