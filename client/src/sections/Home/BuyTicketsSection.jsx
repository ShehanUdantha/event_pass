import React from "react";
import { NFtTicketsImage } from "../../constants";
import { Ethereum, GalleryFavorite } from "iconsax-react";
import { Link } from "react-router-dom";

const BuyTicketsSection = () => {
  return (
    <section className="bg-white py-[4rem] px-5 md:px-0">
      <div className="max-w-4xl h-[50rem] md:h-[33rem] overflow-hidden border rounded-3xl mx-auto flex flex-col md:flex-row gap-1 justify-center items-center">
        {/* <div className="w-full h-full">
          <img
            src={NFTTickets}
            alt="NFTTickets"
            className="w-full h-full object-cover rounded-bl-3xl rounded-br-3xl md:rounded-br-[0px] md:rounded-tl-3xl"
          />
        </div> */}
        <div className="h-full w-full">
          <div
            className="bg-cover bg-center h-full w-full"
            style={{
              backgroundImage: `url(${NFtTicketsImage})`,
            }}
          />
        </div>
        <div className="w-full h-full p-8 md:p-14">
          <span className="max-w-sm font-semibold text-[25px] leading-none tracking-tight md:text-[38px]">
            NFT Collectibles
          </span>
          <div className="pt-5 justify-center md:justify-start">
            <span className="max-w-sm text-[1.01rem] font-normal leading-none tracking-tight text-gray-500">
              Proof of attendance NFTs, Superfan Collectibles & Loyalty Rewards.
              Connect with your communities and celebrate your fans.
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

          <Link
            key={"home-hero-view"}
            to={"/events"}
            className="mt-[4rem] w-[9rem] h-[3rem] border rounded-3xl flex justify-center items-center cursor-pointer"
          >
            <span className="text-[1.01rem] font-semibold">
              Purchase Ticket
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BuyTicketsSection;
