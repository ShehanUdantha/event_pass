import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useStateContext } from "../../context";
import { getUrlParams } from "../../utils/index";
import { RxReload } from "react-icons/rx";
import Spinner from "../../assets/images/spinning-dots.svg";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ScanSection = () => {
  const { contract, verifyTicket, checkVerificationStatus } = useStateContext();
  const { id } = useParams();
  const [ticketInfo, setTicketInfo] = useState("");
  const [ticketId, setTicketId] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const notifyWrongTicket = () =>
    toast.error("Ticket does not match with this event");

  const initScanner = () => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: { width: 200, height: 200 },
      fps: 5,
    });
    scanner.render(success, error);

    function success(value) {
      fetchTicketInfo(value);
      scanner.clear();
    }
    function error(value) {
      console.log(value);
    }
  };

  useEffect(() => {
    if (contract) initScanner();
  }, []);

  const fetchTicketInfo = async (value) => {
    setIsLoading(true);
    const response = getUrlParams(value);
    setTicketId(response.ticketId);

    if (response.eventId == id) {
      // console.log(response.address);
      // console.log(response.eventId);
      // console.log(response.ticketId);
      await verifyTicket(response.address, response.ticketId, response.eventId);
      setIsLoading(false);
      checkTicketVerification(value);
    } else {
      notifyWrongTicket();
    }
    setIsLoading(false);
  };

  const checkTicketVerification = async (value) => {
    setIsLoading(true);
    const response = getUrlParams(value);
    setTicketId(response.ticketId);

    if (response.eventId == id) {
      // console.log(response.address);
      // console.log(response.eventId);
      // console.log(response.ticketId);
      const data = await checkVerificationStatus(
        response.address,
        response.ticketId,
        response.eventId
      );
      // console.log(data);
      setTicketInfo(data);
      setIsLoading(false);
    } else {
      notifyWrongTicket();
    }
    setIsLoading(false);
  };

  return (
    <section className="my-10 min-h-[50svh]">
      <div className="mx-auto max-w-7xl">
        <div className="w-full gap-0 md:gap-30 flex flex-col md:flex-row items-center justify-center">
          <div className="w-full flex items-center justify-center h-[15rem]">
            <div
              id="reader"
              className={`${ticketInfo === "" ? "w-[15rem]" : "w-0"}`}
            ></div>
            {ticketInfo != "" ? (
              <div
                onClick={() => {
                  setTicketInfo("");
                  initScanner();
                }}
                className="flex flex-col items-center justify-center w-[15rem] h-[5rem] bg-[#F6F6F6] rounded cursor-pointer"
              >
                <RxReload />
                <p>Scan again</p>
              </div>
            ) : null}
          </div>
          <div className="w-full flex items-center justify-center md:h-[15rem]">
            {isLoading ? (
              <div className="flex justify-center items-center text-[14px]">
                <img
                  src={Spinner}
                  alt="spinner"
                  className="w-[60px] h-[60px] object-contain"
                />
              </div>
            ) : ticketInfo ? (
              <div className="font-bold text-[18px]">
                Ticket {ticketId}: {ticketInfo}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </section>
  );
};

export default ScanSection;
