import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ScanSection from "../sections/Scanner/ScanSection";
import { useStateContext } from "../context";
import { useParams } from "react-router-dom";
import Spinner from "../assets/images/spinning-dots.svg";
import PageNotFound from "./NotFound";

const Scanner = () => {
  const { id } = useParams();

  const { contract, address, getSingleEvent } = useStateContext();
  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvent = async () => {
    setIsLoading(true);

    if (!isNaN(+id)) {
      const data = await getSingleEvent(id);
      // console.log(data);
      setEvent(data);
    } else {
      setEvent({ id: 0 });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (contract && id) fetchEvent();
  }, [contract, address]);

  return (
    <div>
      {/* header section */}
      <Header title={"Verify Your Tickets"} />
      {/* scan section */}
      {isLoading ? (
        <div className="flex justify-center items-center text-[14px] h-[50svh]">
          <img
            src={Spinner}
            alt="spinner"
            className="w-[60px] h-[60px] object-contain"
          />
        </div>
      ) : (
        <>
          {event.id === 0 || event.owner != address ? (
            <PageNotFound />
          ) : (
            <ScanSection />
          )}
        </>
      )}
    </div>
  );
};

export default Scanner;
