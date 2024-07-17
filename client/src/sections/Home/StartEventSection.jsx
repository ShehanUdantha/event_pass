import React from "react";
import { TicketOnLinSellingImage } from "../../constants";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context";
import toast, { Toaster } from "react-hot-toast";

const StartEventSection = () => {
  const { address } = useStateContext();
  const notifyConnectWallet = () => toast.error("Please connect your wallet");

  return (
    <section className="bg-white py-[4rem] px-5 md:px-0">
      <div className="max-w-4xl h-[55rem] md:h-[33rem] overflow-hidden mx-auto flex flex-col md:flex-row gap-1 justify-center items-center">
        <div className="w-full h-full bg-slate-50 rounded-3xl">
          <div className="p-10 md:p-14 h-full w-full">
            <div
              className="bg-cover bg-center min-h-[15.5rem] h-full w-full rounded-[1.5rem]"
              style={{
                backgroundImage: `url(${TicketOnLinSellingImage})`,
              }}
            />
          </div>
        </div>
        <div className="w-full h-full p-8 md:p-14 max-h-[26rem] md:max-h-full">
          <span className="max-w-sm font-semibold text-[25px] leading-none tracking-tight md:text-[38px]">
            Already Selling Tickets Online?
          </span>
          <div className="pt-5 justify-center md:justify-start">
            <span className="max-w-sm text-[1.01rem] font-normal leading-none tracking-tight text-gray-500">
              Already a seasoned player in the online ticketing world? Think of
              EventPass as your dynamic sidekick. Integrate our platform
              alongside your existing solutions, and tap into a fresh audience
              eager for events. With us, you're not just diversifying; you're
              amplifying your reach, securing more sales, and leaving no ticket
              unsold.
            </span>
          </div>

          {address == undefined ? (
            <div
              onClick={() => notifyConnectWallet()}
              className="mt-[3rem] w-[10rem] h-[3rem] border rounded-3xl flex justify-center items-center cursor-pointer text-white bg-[#4338ca] hover:bg-[#6366f1] transition hover:-translate-y-1 hover:scale-105 duration-900"
            >
              <span className="text-[1.01rem] font-semibold">
                Create an Event
              </span>
            </div>
          ) : (
            <Link
              key={"home-start-event-view"}
              to={"/create-event"}
              className="mt-[3rem] w-[10rem] h-[3rem] border rounded-3xl flex justify-center items-center cursor-pointer text-white bg-[#4338ca] hover:bg-[#6366f1] transition hover:-translate-y-1 hover:scale-105 duration-900"
            >
              <span className="text-[1.01rem] font-semibold">
                Create an Event
              </span>
            </Link>
          )}
        </div>
      </div>
      <Toaster position="bottom-center" />
    </section>
  );
};

export default StartEventSection;
