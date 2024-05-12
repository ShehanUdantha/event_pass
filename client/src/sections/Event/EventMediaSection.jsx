import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context";
import VideoSlider from "../../components/VideoSlider";
import Spinner from "../../assets/images/spinning-dots.svg";

const EventMediaSection = ({ eventId }) => {
  const { contract, address, getEventMediaByEventId } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState([]);

  const fetchEventMedia = async () => {
    setIsLoading(true);
    if (!isNaN(+eventId)) {
      const data = await getEventMediaByEventId(eventId);
      setVideos(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contract && eventId) {
      fetchEventMedia();
    } else {
      setVideos([]);
    }
  }, [contract, address]);

  return (
    <>
      {videos.length > 0 ? (
        <section className="pt-5 pb-16 bg-[#F6F8FD] h-[23rem]">
          <div className="mx-auto max-w-7xl px-4">
            {/* section title */}
            <h2 className="font-bold text-[26px] leading-none tracking-tight">
              Event Media
            </h2>
            {/* video grid view */}
            <section className="mt-10 md:mt-10">
              {isLoading ? (
                <div className="flex justify-center items-center text-[14px] h-[20rem]">
                  <img
                    src={Spinner}
                    alt="spinner"
                    className="w-[60px] h-[60px] object-contain"
                  />
                </div>
              ) : (
                <div className="mx-auto max-w-7xl px-4">
                  <VideoSlider list={videos} />
                </div>
              )}
            </section>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default EventMediaSection;
