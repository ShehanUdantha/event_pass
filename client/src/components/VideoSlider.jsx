import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import videojs from "video.js";
import VideoPlayer from "./VideoPlayer";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const VideoSlider = ({ list }) => {
  const playerRef = useRef();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Call the function to check initially
    checkIfMobile();

    // Add event listener to resize event to dynamically adjust
    window.addEventListener("resize", checkIfMobile);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

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
    <Swiper
      effect={"coverflow"}
      slidesPerView={isMobile ? 1 : 3}
      coverflowEffect={{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false,
      }}
      pagination={true}
      spaceBetween={50}
    >
      {list.map((item) => (
        <SwiperSlide key={item.id}>
          <div className="w-full max-w-3/5 aspect-video overflow-hidden rounded-[20px]">
            <VideoPlayer onReady={handlePlayerReady} videoUrl={item.videoUrl} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default VideoSlider;
