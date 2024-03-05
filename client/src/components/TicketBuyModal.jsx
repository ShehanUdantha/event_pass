import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { TOTAL_TICKET_CAN_PURCHASE } from "../constants";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useStateContext } from "../context";
import toast, { Toaster } from "react-hot-toast";
import { ethers } from "ethers";
import Loader from "./Loader";
import { calculateRemainingTime } from "../utils/index";

const TicketBuyModal = ({
  eventId,
  eventOwner,
  ticketCost,
  startsAt,
  isVisible,
  onClose,
  onCallBack,
}) => {
  if (!isVisible) return null;

  const { buyTickets, contract, address, connect, signer } = useStateContext();

  useEffect(() => {
    if (address) {
      getBalance();
    } else {
      setUserBalance("0.0");
    }
  }, [address]);

  const schema = yup.object().shape({
    ticketAmount: yup
      .number("Ticket amount must be a number")
      .typeError("Please enter the number of tickets")
      .positive("Ticket amount must be a positive number")
      .min(1, "Minimum ticket amount should be 1")
      .max(5, "maximum ticket amount should be 5")
      .required("Please enter the number of tickets"),
  });

  const notifyEventNotFound = () => toast.error("Event not found!");
  const notifyEventExpired = () => toast.error("Event expired!");
  const notifyUnAuthorized = () => toast.error("Unauthorized entity");
  const InsufficientAmount = () => toast.error("Insufficient amount");
  const somethingWentWrong = () => toast.error("Something went wrong!");
  const notifyOwnerCantPurchase = () =>
    toast.error("Event owner cannot purchase tickets");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [userBalance, setUserBalance] = useState("0.0");

  const getBalance = async () => {
    const balance = await signer?.getBalance();
    setUserBalance(
      balance ? ethers.utils.formatEther(balance?.toString()) : "0.0"
    );
  };

  const onSubmit = async (data) => {
    if (eventId != null && eventId > 0 && ethers.utils.isAddress(eventOwner)) {
      if (address && contract) {
        if (calculateRemainingTime(startsAt) != "Expired") {
          if (address != eventOwner) {
            if (userBalance > ticketCost * data.ticketAmount) {
              setIsLoading(true);
              const response = await buyTickets({
                eventId: eventId,
                numOfTicket: data.ticketAmount,
                ticketCost: ticketCost,
              });
              if (response) {
                onClose();
                onCallBack();
              } else {
                somethingWentWrong();
              }
              setIsLoading(false);
            } else {
              InsufficientAmount();
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
        }
        notifyUnAuthorized();
      }
    } else {
      notifyEventNotFound();
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      <div className="fixed inset-0 z-5 h-screen px-4 bg-[#000000b3] backdrop-blur-sm flex items-center justify-center">
        <div className="w-[600px] flex flex-col bg-white p-6 rounded-xl">
          {/* modal close button */}
          <IoClose
            onClick={() => onClose()}
            className="text-black place-self-end mb-1 cursor-pointer"
          />
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ticket amount */}
            <div className="w-full">
              <p className="text-[14px] font-medium mb-1">
                Enter ticket amount
              </p>
              <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
                <input
                  className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                  type="number"
                  min={1}
                  max={TOTAL_TICKET_CAN_PURCHASE}
                  placeholder="Enter the number between 1 to 5"
                  name="ticketAmount"
                  {...register("ticketAmount")}
                />
              </div>
              <p className="text-[12px] text-red-500">
                {errors.ticketAmount?.message}
              </p>
            </div>

            {/* submit button */}
            <div className="flex mt-5 text-white justify-center">
              <input
                className="bg-[#4338ca] cursor-pointer px-10 py-2 font-medium rounded hover:bg-[#6366f1] transition-all duration-200 ease-in"
                type="submit"
              />
            </div>
          </form>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </>
  );
};

export default TicketBuyModal;
