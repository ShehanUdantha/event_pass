import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import PageNotFound from "./NotFound";
import MediaSection from "../sections/Media/MediaSection";
import { useStateContext } from "../context";
import { useParams } from "react-router-dom";
import Spinner from "../assets/images/spinning-dots.svg";

const Media = () => {
  const { id } = useParams();

  const { contract, address, getSingleEvent } = useStateContext();
  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvent = async () => {
    setIsLoading(true);

    if (!isNaN(+id)) {
      const data = await getSingleEvent(id);
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
      {isLoading ? (
        <div className="flex justify-center items-center text-[14px] h-screen">
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
            <div>
              {/* header section */}
              <Header title={"Event Media"} />
              <MediaSection />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Media;
