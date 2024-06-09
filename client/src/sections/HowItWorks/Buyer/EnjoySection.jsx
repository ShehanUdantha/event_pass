import React from "react";
import { EnjoyTicketImage } from "../../../constants";
import { Ethereum, Wallet1 } from "iconsax-react";

const EnjoySection = () => {
  return (
    <section className="bg-white pb-[4rem] px-5 md:px-0">
      <div className="max-w-4xl h-[60rem] md:h-[33rem] bg-slate-50 rounded-3xl overflow-hidden mx-auto flex flex-col-reverse md:flex-row gap-1 justify-center items-center">
        <div className="w-full h-full p-12 md:p-14">
          <div className="w-[3.5rem] h-[3.5rem]  mb-3 flex justify-center items-center font-semibold text-[25px] md:text-[38px] rounded-full border">
            4
          </div>
          <span className="max-w-sm font-semibold text-[25px] leading-none tracking-tight md:text-[38px]">
            Enjoy
          </span>
          <div className="pt-5 justify-center md:justify-start">
            <span className="max-w-sm text-[1.01rem] font-normal leading-none tracking-tight text-gray-500">
              No more fumbling with complex settings. Set up your event in
              moments. From multiple ticket types to time slots, from event
              checkout settings to real-time notifications, we've got you
              covered.
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 pt-5">
            <div className="flex justify-start items-center gap-3">
              <div className="bg-gray-100 rounded-full flex items-center justify-center w-8 h-8">
                <Ethereum size={19} />
              </div>
              <span className="text-[1.01rem] font-semibold">Ethereum Pay</span>
            </div>

            <div className="flex justify-start items-center gap-3">
              <div className="bg-gray-100 rounded-full flex items-center justify-center w-8 h-8">
                <Wallet1 size={19} />
              </div>
              <span className="text-[1.01rem] font-semibold">
                Save tickets as NFT
              </span>
            </div>
          </div>

          <div className="mt-[4rem] w-[8.3rem] h-[3rem] border rounded-3xl flex justify-center items-center cursor-pointer">
            <span className="text-[1.01rem] font-semibold">Start Today</span>
          </div>
        </div>
        <div className="w-full h-full">
          <div className="p-14 h-full w-full">
            <div
              className="bg-cover bg-center h-full w-full rounded-[1.5rem]"
              style={{
                backgroundImage: `url(${EnjoyTicketImage})`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnjoySection;
