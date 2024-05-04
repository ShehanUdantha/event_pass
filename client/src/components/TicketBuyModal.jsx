import React, { useState, useEffect } from "react";
import { useStorageUpload } from "@thirdweb-dev/react";
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
} from "../utils/index";
import { HfInference } from "@huggingface/inference";

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
  const { mutateAsync: upload } = useStorageUpload();

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
                  const result = await generateArt();
                  const uploadedImage = await uploadToIPFS(result, true);
                  const generatedJson = generateJson(uploadedImage);
                  const uploadedJson = await uploadToIPFS(generatedJson, false);

                  // console.log(uploadedImage);
                  // console.log(generatedJson);
                  // console.log(uploadedJson);
                  generatedJsonArray.push(uploadedJson);
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

  const generateArt = async () => {
    const huggingFace = new HfInference(import.meta.env.VITE_IMG_API_KEY);

    try {
      const response = await huggingFace.textToImage({
        data: nftImageGenerateInput,
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

  const uploadToIPFS = async (url, isImage) => {
    let uploadUrl;
    try {
      let tempValue;

      if (isImage === true) {
        const blob = dataURItoBlob(url);
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        tempValue = file;
      } else {
        tempValue = url;
      }

      const tempUrl = await upload({
        data: [tempValue],
        options: {
          uploadWithGatewayUrl: true,
          uploadWithoutDirectory: true,
        },
      });
      uploadUrl = tempUrl[0];
      return uploadUrl;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      return;
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
            <div className="flex mt-5 text-white justify-center">
              <input
                className="bg-[#4338ca] cursor-pointer px-10 py-2 font-medium rounded hover:bg-[#6366f1] transition-all duration-200 ease-in"
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
