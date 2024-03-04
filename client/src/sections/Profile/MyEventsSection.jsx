import React, { useState, useEffect } from "react";
import GridView from "../../components/EventGridView";
import { useStateContext } from "../../context";

const MyEventsSection = () => {
  const { contract, address, getMyEvents } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    setIsLoading(true);
    const data = await getMyEvents();
    setEvents(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract && address) {
      fetchEvents();
    } else {
      setEvents([]);
    }
  }, [contract, address]);

  return (
    <>
      <GridView events={events} isLoading={isLoading} />
    </>
  );
};

export default MyEventsSection;
