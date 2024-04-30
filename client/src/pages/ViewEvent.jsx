import React, { Fragment, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { calculateRemainingTime, formatDateAndTime } from "../utils/index";
import { useStateContext } from "../context";
import { MdMoreVert } from "react-icons/md";
import EventMoreMenu from "../components/EventMoreMenu";
import Spinner from "../assets/images/spinning-dots.svg";
import TicketBuyModal from "../components/TicketBuyModal";
import SecondaryMarketSection from "../sections/ViewEvent/SecondaryMarketSection";
import { FaRegEdit } from "react-icons/fa";
import Loader from "../components/Loader";

const ViewEvent = () => {
  const { id } = useParams();
  const { contract, address, getSingleEvent, getContractOwner } =
    useStateContext();

  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderLoading, setIsLoaderLoading] = useState(false);
  const [remainingTimes, setRemainingTimes] = useState(0);
  const [displayMoreMenu, setDisplayMoreMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [contractOwner, setContractOwner] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchEventData = async () => {
      try {
        if (!isNaN(+id)) {
          const data = await getSingleEvent(id);
          setEvent(data);

          // Start the timer here
          if (data.startsAt) {
            const interval = setInterval(() => {
              setRemainingTimes(calculateRemainingTime(data.startsAt));
            }, 1000);

            return () => clearInterval(interval);
          }
        } else {
          setEvent({ id: 0 });
        }
      } catch (error) {
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
    }
  }, [contract, address, getSingleEvent, getContractOwner, id]);

  const fetchEventDataNormally = async () => {
    try {
      if (!isNaN(+id)) {
        const data = await getSingleEvent(id);
        setEvent(data);

        // Start the timer here
        if (data.startsAt) {
          const interval = setInterval(() => {
            setRemainingTimes(calculateRemainingTime(data.startsAt));
          }, 1000);

          return () => clearInterval(interval);
        }
      } else {
        setEvent({ id: 0 });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching event data: ", error);
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
            <div className="flex justify-center items-center text-[14px] h-screen">
              <div className="text-3xl font-bold">Page Not Found</div>
            </div>
          ) : (
            <Fragment>
              <div className="bg-[#F6F8FD] pt-32 pb-16 h-full">
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
                      <h3 className="font-bold text-2xl md:text-3xl md:leading-12">
                        {event.title}
                      </h3>
                      {/* event more option button */}
                      {event.owner == address || contractOwner == address ? (
                        <div className="flex">
                          {address == event.owner ? (
                            <div className="mr-2">
                              <Link
                                key={event.id + "edit"}
                                to={"/event/" + event.id + "/edit"}
                              >
                                <FaRegEdit
                                  onClick={() => setDisplayMoreMenu(false)}
                                  className="cursor-pointer text-lg"
                                />
                              </Link>
                            </div>
                          ) : null}
                          <div>
                            <MdMoreVert
                              onClick={() =>
                                setDisplayMoreMenu(!displayMoreMenu)
                              }
                              className="cursor-pointer text-lg"
                            />
                            {displayMoreMenu ? (
                              <EventMoreMenu
                                event={event}
                                contractOwner={contractOwner}
                              />
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {/* event remaining and tickets left */}
                    <div className="flex flex-col md:flex-row items-start md:items-center mt-1 justify-start">
                      <div className="text-[14px] text-[#b8b6b6] font-medium md:mr-10">
                        {remainingTimes != "Expired"
                          ? remainingTimes + " remaining"
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
                    {remainingTimes != "Expired" ? (
                      <button
                        onClick={() => setIsVisible(true)}
                        className="bg-[#4338ca] text-white px-6 py-2 font-medium rounded hover:bg-[#6366f1] transition-all duration-200 ease-in mt-5"
                      >
                        Get Tickets
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
              {/* secondary market section */}
              <SecondaryMarketSection
                eventId={id}
                onLoading={(value) => {
                  setIsLoaderLoading(value);
                }}
              />

              {/* ticket buy modal */}
              {isVisible ? (
                <TicketBuyModal
                  eventId={event.id}
                  eventOwner={event.owner}
                  ticketCost={event.ticketCost}
                  startsAt={event.startsAt}
                  isVisible={isVisible}
                  onClose={() => {
                    setIsVisible(false);
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
                      setIsVisible(false);
                    }
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
