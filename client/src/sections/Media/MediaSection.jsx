import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoUploadModal from "../../components/VideoUploadModal";
import VideoGridView from "../../components/VideoGridView";
import { useStateContext } from "../../context";
import Loader from "../../components/Loader";
import Spinner from "../../assets/images/spinning-dots.svg";

const MediaSection = () => {
  const { id } = useParams();
  const {
    contract,
    address,
    getSingleEvent,
    getEventMediaByEventId,
    deleteEventMedia,
  } = useStateContext();

  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaderLoading, setIsLoaderLoading] = useState(false);
  const [isVisibleUpload, setIsVisibleUpload] = useState(false);
  const [videos, setVideos] = useState([]);

  const notifyUnAuthorized = () => toast.error("Unauthorized entity");

  useEffect(() => {
    const fetchData = async () => {
      window.scrollTo(0, 0);
      if (contract && id) {
        if (!isNaN(+id)) {
          setIsLoading(true);
          try {
            const [eventData, mediaData] = await Promise.all([
              getSingleEvent(id),
              getEventMediaByEventId(id),
            ]);
            setEvent(eventData);
            setVideos(mediaData);
          } catch (error) {
            console.error("Error fetching data: ", error);
          } finally {
            setIsLoading(false);
          }
        } else {
          setEvent({ id: 0 });
        }
      }
    };

    fetchData();
  }, [contract, id]);

  const fetchEventMedia = async () => {
    try {
      if (event != null) {
        setIsLoading(true);

        const data = await getEventMediaByEventId(event.id);
        setVideos(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching event media: ", error);
    }
  };

  const callEventMediaDelete = async (mediaId) => {
    if (address == event.owner) {
      setIsLoaderLoading(true);
      const response = await deleteEventMedia(event.id, mediaId);
      setIsLoaderLoading(false);
      fetchEventMedia();
    } else {
      notifyUnAuthorized();
    }
  };

  return (
    <>
      {isLoaderLoading && <Loader />}

      {isLoading ? (
        <div className="flex justify-center items-center text-[14px] h-screen">
          <img
            src={Spinner}
            alt="spinner"
            className="w-[60px] h-[60px] object-contain"
          />
        </div>
      ) : (
        <section className="pt-6 pb-16 h-screen">
          <div className="flex items-center justify-end mx-auto max-w-7xl px-4">
            <button
              className="text-[#4338ca] bg-[#ecebf3] text-[14px] px-[1.2rem] py-[0.4rem] font-medium rounded hover:bg-[#c9caf3] transition-all duration-200 ease-in"
              onClick={() => {
                setIsVisibleUpload(true);
              }}
            >
              Add Media
            </button>
          </div>
          <div>
            <VideoGridView
              videos={videos}
              isLoading={isLoading}
              callBackFunction={async (mediaId) => {
                await callEventMediaDelete(mediaId);
              }}
            />
          </div>

          {/* upload modal */}
          {isVisibleUpload ? (
            <VideoUploadModal
              isVisible={isVisibleUpload}
              onClose={() => {
                setIsVisibleUpload(false);
                setIsLoaderLoading(false);
              }}
              onCallBack={() => {
                if (contract && id && address) {
                  fetchEventMedia();
                }
              }}
              onLoading={(value) => {
                setIsLoaderLoading(value);
                if (value === false) {
                  setIsVisibleUpload(false);
                }
              }}
              event={event}
            />
          ) : null}
        </section>
      )}
    </>
  );
};

export default MediaSection;
