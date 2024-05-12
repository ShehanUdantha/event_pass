import React, { useRef } from "react";
import videojs from "video.js";
import VideoPlayer from "./VideoPlayer";
import { MdDeleteOutline } from "react-icons/md";
import Spinner from "../assets/images/spinning-dots.svg";

const VideoGridView = ({ videos, isLoading, callBackFunction }) => {
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
    <section className="mt-10">
      {isLoading ? (
        <div className="flex justify-center items-center text-[14px] h-[20rem]">
          <img
            src={Spinner}
            alt="spinner"
            className="w-[60px] h-[60px] object-contain"
          />
        </div>
      ) : videos != null && videos.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-4 grid-cols-1 gap-8">
          {videos.map((video) => (
            <div key={video.id}>
              <div className="w-full max-w-3/5 aspect-video overflow-hidden rounded-[20px]">
                <VideoPlayer
                  onReady={handlePlayerReady}
                  videoUrl={video.videoUrl}
                />
              </div>
              <div className="flex items-center justify-between gap-2 mt-2 overflow-hidden">
                <div className="bg-gray-100 text-gray-500 font-bold text-[10px] max-h-8 p-1 rounded-md text-ellipsis overflow-hidden">
                  {video.title}
                </div>

                <MdDeleteOutline
                  className="text-red-400 cursor-pointer w-8"
                  onClick={() => callBackFunction(video.id)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center text-[14px] h-[25rem]">
          No Any Videos Found!
        </div>
      )}
    </section>
  );
};

export default VideoGridView;
