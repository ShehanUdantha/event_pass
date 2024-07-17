import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  TOTAL_TICKET_CAN_PURCHASE,
  nftImageGenerateInput,
  imageGenerateModel,
} from "../constants";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useStateContext } from "../context";
import toast, { Toaster } from "react-hot-toast";
import { ethers } from "ethers";
import {
  calculateRemainingTime,
  dataURItoBlob,
  generateJson,
  generateRandomRGB,
} from "../utils/index";
import { HfInference } from "@huggingface/inference";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../services/pinata";

const TicketBuyModal = ({
  eventId,
  eventOwner,
  ticketCost,
  startsAt,
  isVisible,
  onClose,
  onCallBack,
  onLoading,
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
      .max(
        TOTAL_TICKET_CAN_PURCHASE,
        `maximum ticket amount should be ${TOTAL_TICKET_CAN_PURCHASE}`
      )
      .required("Please enter the number of tickets"),
  });

  const notifyEventNotFound = () => toast.error("Event not found!");
  const notifyEventExpired = () => toast.error("Event expired!");
  const notifyUnAuthorized = () => toast.error("Unauthorized entity");
  const InsufficientAmount = () => toast.error("Insufficient amount");
  const somethingWentWrong = () => toast.error("Something went wrong!");
  const notifyOwnerCantPurchase = () =>
    toast.error("Event owner cannot purchase tickets");
  const notifyConnectWallet = () => toast.error("Please connect your wallet");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
              onLoading(true);
              const generatedJsonArray = [];
              try {
                for (let i = 0; i < data.ticketAmount; i++) {
                  const randomColor = generateRandomRGB();
                  const result = await generateArt(randomColor);
                  const blob = dataURItoBlob(result);
                  const newRandomNumber = Math.floor(Math.random() * 500) + 1;

                  const file = new File(
                    [blob],
                    `${eventId}_${newRandomNumber}_image.jpg`,
                    {
                      type: "image/jpeg",
                    }
                  );

                  const uploadedImageResponse = await uploadFileToIPFS(
                    file,
                    `event_${eventId}`,
                    `${file.name}`
                  );

                  if (uploadedImageResponse.success === true) {
                    const generatedJson = generateJson(
                      uploadedImageResponse.pinataURL,
                      randomColor
                    );
                    const uploadedJsonResponse = await uploadJSONToIPFS(
                      generatedJson,
                      `${eventId}_${newRandomNumber}.json`
                    );

                    if (uploadedJsonResponse.success === true) {
                      // console.log(randomColor);
                      // console.log(uploadedImageResponse.pinataURL);
                      // console.log(uploadedJsonResponse.pinataURL);

                      generatedJsonArray.push(uploadedJsonResponse.pinataURL);
                    } else {
                      console.error("Error uploading json:", response.message);
                      onLoading(false);
                    }
                  } else {
                    console.error("Error uploading image:", response.message);
                    onLoading(false);
                  }

                  setTimeout(() => {}, 2000);
                }

                if (generatedJsonArray.length === data.ticketAmount) {
                  const response = await buyTickets({
                    eventId: eventId,
                    numOfTicket: data.ticketAmount,
                    ticketCost: ticketCost,
                    tokenURIs: generatedJsonArray,
                  });

                  if (response) {
                    onCallBack();
                    onClose();
                  } else {
                    somethingWentWrong();
                  }
                }
              } catch (error) {
                console.error("Error generating art or buying tickets:", error);
                onLoading(false);
                somethingWentWrong();
              }
              onLoading(false);
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
          notifyConnectWallet();
        }
        notifyUnAuthorized();
      }
    } else {
      notifyEventNotFound();
    }
  };

  const generateArt = async (randomColor) => {
    const huggingFace = new HfInference(import.meta.env.VITE_IMG_API_KEY);

    try {
      const response = await huggingFace.textToImage({
        data: nftImageGenerateInput + randomColor,
        model: imageGenerateModel,
      });

      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const myDataUrl = reader.result;
          resolve(myDataUrl);
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsDataURL(response);
      });
    } catch (error) {
      console.error("Error making API request:", error);
      somethingWentWrong();
      onLoading(false);
      return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-30 h-screen px-4 bg-[#000000b3] backdrop-blur-sm flex items-center justify-center">
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
                  placeholder={`Enter the number between 1 to ${TOTAL_TICKET_CAN_PURCHASE}`}
                  name="ticketAmount"
                  {...register("ticketAmount")}
                />
              </div>
              <p className="text-[12px] text-red-500">
                {errors.ticketAmount?.message}
              </p>
            </div>

            {/* submit button */}
            <div className="flex mt-5 justify-center">
              <input
                className="text-[1.01rem] cursor-pointer font-semibold w-[8rem] h-[2.5rem] border rounded-3xl flex justify-center items-center text-white bg-[#4338ca] hover:bg-[#6366f1] transition hover:-translate-y-1 hover:scale-105 duration-900"
                type="submit"
              />
            </div>
          </form>
        </div>
        <Toaster position="bottom-center" />
      </div>
    </>
  );
};

export default TicketBuyModal;
