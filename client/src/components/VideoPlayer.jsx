import { useEffect, useRef } from "react";

const VideoPlayer = ({ id, publicId, ...props }) => {
  const videoRef = useRef();
  const cloudinaryRef = useRef();
  const playerRef = useRef();

  useEffect(() => {
    if (cloudinaryRef.current) return;

    cloudinaryRef.current = window.cloudinary;

    playerRef.current = cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      secure: true,
    });
  }, []);

  return (
    <div className="w-full md:w-3/5 aspect-video overflow-hidden rounded-[20px]">
      <video
        ref={videoRef}
        id={id}
        className="cld-video-player cld-fluid"
        controls
        autoPlay
        data-cld-public-id={publicId}
        {...props}
      />
    </div>
  );
};

export default VideoPlayer;
