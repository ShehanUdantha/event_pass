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
import SocialSection from "../sections/Home/SocialSection";
import StartEventSection from "../sections/Home/StartEventSection";
import AudienceSection from "../sections/Home/AudienceSection";
import InfoRow from "../sections/Home/InfoRow";
import BuyTicketsSection from "../sections/Home/BuyTicketsSection";

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

  // const handlePlayerReady = (player) => {
  //   playerRef.current = player;

  //   player.on("waiting", () => {
  //     videojs.log("player is waiting");
  //   });

  //   player.on("dispose", () => {
  //     videojs.log("player will dispose");
  //   });
  // };

  return (
    <div>
      {/* hero section */}
      <Hero scrollToEvents={scrollToEvents} onCallBack={() => setOpen(!open)} />
      {/* info row */}
      <InfoRow />
      {/* buy tickets */}
      <BuyTicketsSection />
      {/* promote events */}
      <SocialSection />
      {/* start new event */}
      <StartEventSection />
      {/* audience */}
      <AudienceSection />

      {/* how it works section */}
      {/* <HowItWorksSection /> */}

      {/* chatwoot */}
      <ChatWootWidget />
      {/* video player */}
      {/* {open ? (
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
      ) : null} */}
    </div>
  );
};

export default Home;
