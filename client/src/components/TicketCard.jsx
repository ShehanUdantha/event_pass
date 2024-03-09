import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { formatDateAndTime, calculateRemainingTime } from "../utils/index";
import Spinner from "../assets/images/spinning-dots.svg";
import QRCode from "react-qr-code";
import { Link, useNavigate } from "react-router-dom";
import { MdMoreVert } from "react-icons/md";
import TicketMoreMenu from "./TicketMoreMenu";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import Loader from "./Loader";

const TicketCard = ({ ticket, isSecondary }) => {
  const {
    contract,
    address,
    signer,
    getSingleEvent,
    buyReselledTicket,
    connect,
  } = useStateContext();
  const navigate = useNavigate();

  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isBuyLoading, setIsBuyLoading] = useState(false);
  const [displayMoreMenu, setDisplayMoreMenu] = useState(false);
  const [remainingTimes, setRemainingTimes] = useState(0);
  const [userBalance, setUserBalance] = useState("0.0");

  const notifyEventNotFound = () => toast.error("Event not found!");
  const notifyEventExpired = () => toast.error("Event expired!");
  const notifyUnAuthorized = () => toast.error("Unauthorized entity");
  const InsufficientAmount = () => toast.error("Insufficient amount");
  const somethingWentWrong = () => toast.error("Something went wrong!");
  const notifyOwnerCantPurchase = () =>
    toast.error("Event owner cannot purchase tickets");
  const notifyTicketOwnerCantPurchase = () =>
    toast.error("Ticket owner cannot purchase tickets");
  const notifyConnectWallet = () => toast.error("Please connect your wallet");

  const fetchEvent = async () => {
    setIsLoading(true);
    const data = await getSingleEvent(ticket.eventId);
    console.log(data);
    setEvent(data);
    setRemainingTimes(calculateRemainingTime(data.startsAt));
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract && ticket.eventId) fetchEvent();
    if (address) {
      getBalance();
    } else {
      setUserBalance("0.0");
    }
  }, [contract, address, ticket.eventId]);

  const getBalance = async () => {
    const balance = await signer?.getBalance();
    setUserBalance(
      balance ? ethers.utils.formatEther(balance?.toString()) : "0.0"
    );
  };

  console.log(userBalance);
  console.log(ticket.tokenId);

  const buyResellTicket = async () => {
    if (
      ticket.eventId != null &&
      ticket.eventId > 0 &&
      ethers.utils.isAddress(ticket.owner)
    ) {
      if (address && contract) {
        if (calculateRemainingTime(event.startsAt) != "Expired") {
          if (address != event.owner) {
            if (address != ticket.owner) {
              if (userBalance > event.ticketCost) {
                setIsBuyLoading(true);
                const response = await buyReselledTicket(
                  ticket.eventId,
                  ticket.id,
                  address,
                  ticket.tokenId,
                  event.ticketCost
                );
                if (response) {
                  navigate("/profile");
                } else {
                  somethingWentWrong();
                }
                setIsBuyLoading(false);
              } else {
                InsufficientAmount();
              }
            } else {
              notifyTicketOwnerCantPurchase();
            }
          } else {
            notifyOwnerCantPurchase();
          }
        } else {
          notifyEventExpired();
        }
      } else {
        if (address == null) {
          connect();
          notifyConnectWallet();
        }
        notifyUnAuthorized();
      }
    } else {
      notifyEventNotFound();
    }
  };

  return (
    <>
      {isBuyLoading && <Loader />}
      <div className="shadow-md rounded-[1rem] cursor-pointer w-full">
        {isLoading ? (
          <div className="flex justify-center items-center text-[14px] h-[20rem]">
            <img
              src={Spinner}
              alt="spinner"
              className="w-[60px] h-[60px] object-contain"
            />
          </div>
        ) : (
          <div>
            {isSecondary ? null : (
              <div className="flex justify-end pl-5 pt-3">
                <MdMoreVert
                  onClick={() => setDisplayMoreMenu(!displayMoreMenu)}
                  className="cursor-pointer text-lg"
                />
                {displayMoreMenu ? (
                  <TicketMoreMenu event={event} ticket={ticket} />
                ) : null}
              </div>
            )}
            {isSecondary ? (
              <div>
                <img
                  src={event.imageUrl}
                  alt=""
                  className="w-full rounded-t-[1rem] md:h-[8.5rem]"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <QRCode className="w-[150px] h-[100px]" value={ticket.qrCode} />
              </div>
            )}
            <div className="p-5 pt-2">
              <div className="overflow-hidden">
                <div className="font-bold text-md md:text-lg text-ellipsis overflow-hidden">
                  {event.title}
                </div>
                <div className="flex items-center mt-2">
                  <div className="p-1 bg-green-100 text-green-500 font-bold text-[12px] rounded-md mr-2">
                    ETH {event.ticketCost}
                  </div>
                  <div className="p-1 bg-gray-100 text-gray-500 font-bold text-[12px] rounded-md">
                    {event.category}
                  </div>
                </div>
                {isSecondary ? (
                  <div className="w-full text-[12px] text-gray-500 font-medium mt-2 text-ellipsis overflow-hidden">
                    by {ticket.owner}
                  </div>
                ) : null}
                <div className="text-[13px] text-gray-600 font-medium mt-1">
                  {formatDateAndTime(event.startsAt)}
                </div>

                {isSecondary ? (
                  remainingTimes != "Expired" ? (
                    <div className="flex justify-center">
                      <button
                        onClick={() => buyResellTicket()}
                        className="bg-[#4338ca] text-white text-[14px] px-5 py-1 font-medium rounded hover:bg-[#6366f1] transition-all duration-200 ease-in mt-5"
                      >
                        Get Ticket
                      </button>
                    </div>
                  ) : null
                ) : null}
              </div>
            </div>
          </div>
        )}
        <Toaster position="bottom-right" />
      </div>
    </>
  );
};

export default TicketCard;
