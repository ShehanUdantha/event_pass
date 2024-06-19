import React from "react";
import { CustomerImage } from "../../constants";
import { Ethereum, GalleryFavorite } from "iconsax-react";

const AudienceSection = () => {
  return (
    <section className="bg-white py-[4rem] px-5 md:px-0">
      <div className="max-w-4xl h-[60rem] md:h-[33rem] overflow-hidden mx-auto flex flex-col-reverse md:flex-row gap-1 justify-center items-center">
        <div className="w-full h-full p-8 md:p-14">
          <span className="max-w-sm font-semibold text-[25px] leading-none tracking-tight md:text-[38px]">
            Keep Your Customers Coming Back
          </span>
          <div className="pt-5 justify-center md:justify-start">
            <span className="max-w-sm text-[1.01rem] font-normal leading-none tracking-tight text-gray-500">
              Every event you create is more than just an occasion. it's a
              promise of memories, joy, and shared experiences. With our premier
              ticketing experience, attendees not only experience your
              spectacle, but they're also inspired to return, time and time
              again, captivated by the seamless journey we offer.
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
                <GalleryFavorite size={19} />
              </div>
              <span className="text-[1.01rem] font-semibold">
                Save tickets as NFT
              </span>
            </div>
          </div>

          {/* <div className="mt-[4rem] w-[10rem] h-[3rem] border rounded-3xl flex justify-center items-center cursor-pointer bg-[#4338ca] text-white">
            <span className="text-[1.01rem] font-semibold">Connect Wallet</span>
          </div> */}
        </div>
        <div className="w-full h-full bg-slate-50 rounded-3xl">
          <div className="p-10 md:p-14 h-full w-full">
            <div
              className="bg-cover bg-center h-full w-full rounded-[1.5rem]"
              style={{
                backgroundImage: `url(${CustomerImage})`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
