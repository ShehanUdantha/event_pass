import React, { useEffect, useState } from "react";
import Hero from "../sections/Home/Hero";
import Filter from "../sections/Home/FilterSection";
import GridView from "../components/EventGridView";
import PaginationSection from "../sections/Home/PaginationSection";
import Footer from "../components/Footer";
import { useStateContext } from "../context";

const Home = () => {
  const { contract, address, getAllEvents } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    setIsLoading(true);
    const data = await getAllEvents();
    setEvents(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchEvents();
  }, [contract, address]);

  console.log(events);

  return (
    <div>
      {/* hero section */}
      <Hero />
      {/* filter section */}
      <Filter />
      {/* grid view */}
      <GridView events={events} />
      {/* pagination section */}
      <PaginationSection />
      {/* footer */}
      <Footer />
    </div>
  );
};

export default Home;
