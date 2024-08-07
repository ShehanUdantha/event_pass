import React, { useEffect, useState, useRef } from "react";
import GridView from "../components/EventGridView";
import PaginationSection from "../sections/AllEvents/PaginationSection";
import { useStateContext } from "../context";
import { eventCategoryList } from "../constants/index";
import { IoSearchOutline } from "react-icons/io5";
import Hero from "../sections/AllEvents/Hero";
import InfoRow from "../sections/AllEvents/InfoRow";

const AllEvents = () => {
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

    if (category && category !== "All") {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (search && search.trim() !== "") {
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

  const scrollToEvents = () => {
    const navbarHeight = 90;
    const targetPosition =
      eventsRef.current.getBoundingClientRect().top +
      window.pageYOffset -
      navbarHeight;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 500;
    let start = null;

    const smoothScroll = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startPosition + distance * progress);
      if (elapsed < duration) requestAnimationFrame(smoothScroll);
    };

    requestAnimationFrame(smoothScroll);
  };

  return (
    <div>
      {/* hero section */}
      <Hero scrollToEvents={scrollToEvents} />
      {/* info row */}
      <InfoRow />
      {/* filter section */}
      <section className="mt-10 md:mb-14 md:mt-[7.5rem]" ref={eventsRef}>
        <div className="mx-auto max-w-7xl px-4">
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
      <GridView events={filteredEvents} isLoading={isLoading} />
      {/* pagination section */}
      <PaginationSection />
    </div>
  );
};

export default AllEvents;
