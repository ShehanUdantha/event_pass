import React, { useRef } from "react";
import videojs from "video.js";
import VideoPlayer from "../../components/VideoPlayer";
import { infoVideoUrl } from "../../constants/index";

const VideoInfo = () => {
  const playerRef = useRef();

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
    <section className="bg-white mt-[7.4rem] pb-10">
      <div className="flex flex-col md:flex-row mx-auto items-center justify-center max-w-6xl px-4 gap-4 md:gap-6">
        <div className="w-full md:w-4/5 aspect-video overflow-hidden rounded-[20px]">
          <VideoPlayer onReady={handlePlayerReady} videoUrl={infoVideoUrl} />
        </div>
      </div>
    </section>
  );
};

export default VideoInfo;
