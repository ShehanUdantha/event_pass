import React from "react";
import WorkProgressCard from "../../components/WorkProgressCard";
import { BsWallet2 } from "react-icons/bs";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { BsTicketDetailed } from "react-icons/bs";
import { BsShopWindow } from "react-icons/bs";

const HowItWorksSection = () => {
  return (
    <section className="bg-white py-[4rem] px-5 md:px-0">
      <div className="py-3 max-w-4xl mx-auto flex flex-col justify-center items-center">
        {/* section title */}
        <span className="max-w-sm font-semibold text-[25px] leading-none tracking-tight md:text-[38px]">
          How it Works?
        </span>
        <div className="mt-[4.5rem] mx-auto w-full grid md:grid-cols-4 grid-cols-1 gap-3 md:gap-9">
          <WorkProgressCard
            icon={<BsWallet2 />}
            title={"Set up your Wallet"}
            description={
              "Start with creating your account using the Metamask Wallet"
            }
          />
          <WorkProgressCard
            icon={<HiOutlineViewGridAdd />}
            title={"Choose an Event"}
            description={
              "Search for the event to check all details and tickets"
            }
          />
          <WorkProgressCard
            icon={<BsTicketDetailed />}
            title={"Buy NFT Tickets"}
            description={
              "Select the tickets you want to buy and pay for them with ETH"
            }
          />
          <WorkProgressCard
            icon={<BsShopWindow />}
            title={"Enjoy!"}
            description={
              "Go to the event and verify tickets directly in your account"
            }
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
