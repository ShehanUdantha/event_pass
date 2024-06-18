import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { calculateRemainingTime, formatDateAndTime } from "../utils/index";
import { useStateContext } from "../context";
import Spinner from "../assets/images/spinning-dots.svg";
import TicketBuyModal from "../components/TicketBuyModal";
import SocialMediaShareModal from "../components/SocialMediaShareModal";
import SecondaryMarketSection from "../sections/Event/SecondaryMarketSection";
import EventMediaSection from "../sections/Event/EventMediaSection";
import Loader from "../components/Loader";
import { IoShareSocialSharp } from "react-icons/io5";
import { HfInference } from "@huggingface/inference";
import { nftImageGenerateInput, imageGenerateModel } from "../constants";
import PageNotFound from "./NotFound";

const useEventTimer = (startsAt) => {
  const [remainingTime, setRemainingTime] = useState(
    calculateRemainingTime(startsAt)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime(startsAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [startsAt]);

  return remainingTime;
};

const ViewEvent = () => {
  const { id } = useParams();
  const { contract, address, getSingleEvent, getContractOwner } =
    useStateContext();

  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderLoading, setIsLoaderLoading] = useState(false);
  const [isVisibleBuy, setIsVisibleBuy] = useState(false);
  const [isVisibleShare, setIsVisibleShare] = useState(false);
  const [contractOwner, setContractOwner] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchEventData = async () => {
      try {
        if (!isNaN(+id)) {
          const data = await getSingleEvent(id);
          setEvent(data);
          setIsLoading(false);
        } else {
          setEvent({ id: 0 });
          setIsLoading(false);
        }
      } catch (error) {
        setEvent({ id: 0 });
        setIsLoading(false);
        console.error("Error fetching event data: ", error);
      }
    };

    const fetchContractOwner = async () => {
      try {
        const data = await getContractOwner();
        setContractOwner(data);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching contract owner: ", error);
      }
    };

    if (contract && id && !isLoaderLoading) {
      setIsLoading(true);
      fetchContractOwner();
      fetchEventData();
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      // development purpose
      activateImageGenerateServer();
    }
  }, [contract, address, getSingleEvent, getContractOwner, id]);

  const fetchEventDataNormally = async () => {
    try {
      if (!isNaN(+id)) {
        const data = await getSingleEvent(id);
        setEvent(data);
        setIsLoading(false);
      } else {
        setEvent({ id: 0 });
        setIsLoading(false);
      }
    } catch (error) {
      setEvent({ id: 0 });
      setIsLoading(false);
      console.error("Error fetching event data: ", error);
    }
  };

  const remainingTime = useEventTimer(event.startsAt);

  const eventMediaSection = useMemo(() => {
    return <EventMediaSection eventId={id} />;
  }, [id]);

  const activateImageGenerateServer = async () => {
    const huggingFace = new HfInference(import.meta.env.VITE_IMG_API_KEY);

    try {
      const response = await huggingFace.textToImage({
        data: nftImageGenerateInput,
        model: imageGenerateModel,
      });
      // console.log("call to server", response);
    } catch (error) {
      console.error("Error making API request:", error);
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
        <>
          {event.id === 0 ? (
            <PageNotFound />
          ) : (
            <Fragment>
              <div className="bg-white pt-32 pb-16 h-full">
                <div className="flex flex-col md:flex-row mx-auto items-center md:items-start justify-center md:justify-start gap-5 max-w-7xl px-4">
                  {/* event image */}
                  <div className="w-full">
                    <img
                      src={event.imageUrl}
                      alt=""
                      className="w-full rounded-lg md:h-[25rem]"
                    />
                  </div>
                  {/* event text details */}
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-1">
                      {/* event title */}
                      <h3 className="font-bold text-2xl md:text-3xl md:leading-8">
                        {event.title}
                      </h3>
                      <div className="flex items-center justify-between gap-3">
                        {/* event share option */}
                        <IoShareSocialSharp
                          onClick={() => {
                            setIsVisibleShare(true);
                            setIsVisibleBuy(false);
                          }}
                          className="cursor-pointer text-lg"
                        />
                        {/* event manage button */}
                        {event.owner == address || contractOwner == address ? (
                          <Link
                            key={event.id + "dashboard"}
                            to={"/event/" + event.id + "/dashboard"}
                            className="text-[#4338ca] bg-[#ecebf3] text-[14px] px-[1.2rem] py-[0.4rem] font-medium rounded hover:bg-[#c9caf3] transition-all duration-200 ease-in"
                          >
                            Manage
                          </Link>
                        ) : null}
                      </div>
                    </div>
                    {/* event remaining and tickets left */}
                    <div className="flex flex-col md:flex-row items-start md:items-center mt-3 justify-start">
                      <div className="text-[14px] text-[#b8b6b6] font-medium md:mr-10">
                        {remainingTime != "Expired"
                          ? remainingTime + " remaining"
                          : "Expired"}
                      </div>
                      <div className="text-[14px] text-[#686666] font-medium mt-2 md:mt-0">
                        {event.ticketRemain} tickets left
                      </div>
                    </div>
                    {/* event ticket price and event owner */}
                    <div className="flex flex-row items-center mt-3">
                      <div className="p-1 bg-green-100 text-green-500 font-bold text-[12px] rounded-md mr-2">
                        ETH {event.ticketCost}
                      </div>
                      <div className="p-1 bg-gray-100 text-gray-500 font-bold text-[12px] rounded-md">
                        {event.category}
                      </div>
                    </div>
                    {/* owner details */}
                    <div className="w-full text-[14px] text-gray-500 font-medium mt-2 text-ellipsis overflow-hidden">
                      by {event.owner}
                    </div>
                    {/* buy ticket button */}
                    {remainingTime != "Expired" && remainingTime != "0" ? (
                      <button
                        onClick={() => {
                          setIsVisibleBuy(true);
                          setIsVisibleShare(false);
                          // development purpose
                          activateImageGenerateServer();
                        }}
                        className="mt-5 w-[8rem] h-[2.5rem] border rounded-3xl flex justify-center items-center cursor-pointer text-white bg-[#4338ca] hover:bg-[#6366f1] transition hover:-translate-y-1 hover:scale-105 duration-900"
                      >
                        <span className="text-[1.01rem] font-semibold">
                          Get Tickets
                        </span>
                      </button>
                    ) : null}

                    {/* event time */}
                    <div className="flex flex-col md:flex-row items-start md:items-center mt-5 justify-start">
                      <div className="flex flex-row">
                        <div className="text-[14px] font-medium mr-1">
                          Started at:
                        </div>
                        <div className="text-[14px] mr-0 md:mr-10">
                          {formatDateAndTime(event.startsAt)}
                        </div>
                      </div>
                      <div className="flex flex-row mt-[0.2rem] md:mt-0">
                        <div className="text-[14px] font-medium mr-1">
                          Ended at:
                        </div>
                        <div className="text-[14px]">
                          {formatDateAndTime(event.endsAt)}
                        </div>
                      </div>
                    </div>
                    {/* location */}
                    <div className="flex flex-row items-center mt-2">
                      <div className="text-[14px] font-medium mr-1">Venue:</div>
                      <div className="text-[14px] mr-0 md:mr-10">
                        {event.location}
                      </div>
                    </div>
                    {/* event description */}
                    <div className="text-[14px] max-h-[10rem] text-ellipsis overflow-hidden leading-tight mt-5 mb-10 md:mb-0">
                      {event.description}
                    </div>
                  </div>
                </div>
              </div>
              {/* event media section */}
              {eventMediaSection}

              {/* secondary market section */}
              <SecondaryMarketSection
                eventId={id}
                onLoading={(value) => {
                  setIsLoaderLoading(value);
                }}
              />
              {/* ticket buy modal */}
              {isVisibleBuy ? (
                <TicketBuyModal
                  eventId={event.id}
                  eventOwner={event.owner}
                  ticketCost={event.ticketCost}
                  startsAt={event.startsAt}
                  isVisible={isVisibleBuy}
                  onClose={() => {
                    setIsVisibleBuy(false);
                    setIsLoaderLoading(false);
                  }}
                  onCallBack={() => {
                    if (contract && id && address) {
                      fetchEventDataNormally();
                    }
                  }}
                  onLoading={(value) => {
                    setIsLoaderLoading(value);
                    if (value === false) {
                      setIsVisibleBuy(false);
                    }
                  }}
                />
              ) : null}
              {/* event share modal */}
              {isVisibleShare ? (
                <SocialMediaShareModal
                  url={window.location.href}
                  onClose={() => {
                    setIsVisibleShare(false);
                  }}
                />
              ) : null}
            </Fragment>
          )}
        </>
      )}
    </>
  );
};

export default ViewEvent;
