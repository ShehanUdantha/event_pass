import React, { useEffect, useState, useRef } from "react";
import Hero from "../sections/Home/Hero";
import GridView from "../components/EventGridView";
import PaginationSection from "../sections/Home/PaginationSection";
import { useStateContext } from "../context";
import { eventCategoryList, infoVideoUrl } from "../constants/index";
import { IoSearchOutline } from "react-icons/io5";
import HowItWorksSection from "../sections/Home/HowItWorksSection";
import ChatWootWidget from "../widgets/ChatWootWidget";
import videojs from "video.js";
import VideoPlayer from "../components/VideoPlayer";

const Home = () => {
  const { contract, address, getAllEvents } = useStateContext();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const eventsRef = useRef(null);
  const playerRef = useRef();

  const [searchInput, setSearchInput] = useState("");
  const [filteredCategory, setFilteredCategory] = useState();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categoryList, setCategoryList] = useState([
    "All",
    ...eventCategoryList,
  ]);
  const [open, setOpen] = React.useState(false);

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

  // console.log(events);

  const scrollToEvents = () => {
    eventsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <div>
      {/* hero section */}
      <Hero scrollToEvents={scrollToEvents} onCallBack={() => setOpen(!open)} />
      {/* filter section */}
      <section className="mt-10 md:mb-14 md:mt-16" ref={eventsRef}>
        <div className="mx-auto max-w-7xl px-4">
          {/* section title */}
          <h2 className="font-bold text-3xl leading-none tracking-tight">
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
      <GridView events={filteredEvents} isLoading={isLoading} />
      {/* pagination section */}
      <PaginationSection />
      {/* how it works section */}
      <HowItWorksSection />
      {/* chatwoot */}
      <ChatWootWidget />
      {/* video player */}
      {open ? (
        <div
          className="fixed inset-0 z-30 h-screen px-4 bg-[#000000b3] backdrop-blur-sm flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              // Check if the clicked element is the div itself
              setOpen(false);
            }
          }}
        >
          <div className="w-full md:w-3/5 aspect-video overflow-hidden rounded-[20px]">
            <VideoPlayer onReady={handlePlayerReady} videoUrl={infoVideoUrl} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Home;
