import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Spinner from "../../assets/images/spinning-dots.svg";
import { useStateContext } from "../../context";
import { getUrlParams } from "../../utils/index";

const ScanSection = () => {
  const { contract, verifyTicket } = useStateContext();
  const [ticketInfo, setTicketInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: { width: 200, height: 200 },
      fps: 5,
    });
    const qrScannerStop = () => {
      if (scanner && scanner.isScanning) {
        scanner
          .stop()
          .then((ignore) => console.log("Scaner stop"))
          .catch((err) => console.log("Scaner error"));
      }
    };
    scanner.render(success, error);
    function success(value) {
      scanner.clear();
      fetchTicketInfo(value);
      qrScannerStop();
    }
    function error(value) {
      console.log(value);
    }
    return () => {
      qrScannerStop();
    };
  }, []);

  const fetchTicketInfo = async (value) => {
    setIsLoading(true);
    const response = getUrlParams(value);

    const data = await verifyTicket(
      response.address,
      response.eventId,
      response.ticketId
    );
    console.log(data);
    setTicketInfo(data);
    setIsLoading(false);
  };

  return (
    <section className="my-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap">
          <div className="w-full flex justify-center items-center">
            <div className="w-full flex items-center justify-center">
              <div id="reader" className="w-2/5"></div>
            </div>
            <div className="w-full h-60 flex items-center justify-center">
              {isLoading ? (
                <div className="flex justify-center items-center text-[14px] h-[20rem]">
                  <img
                    src={Spinner}
                    alt="spinner"
                    className="w-[60px] h-[60px] object-contain"
                  />
                </div>
              ) : (
                <div>{ticketInfo}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScanSection;
