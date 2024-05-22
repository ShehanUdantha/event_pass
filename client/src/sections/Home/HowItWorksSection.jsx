import React from "react";
import WorkProgressCard from "../../components/WorkProgressCard";
import { BsWallet2 } from "react-icons/bs";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { BsTicketDetailed } from "react-icons/bs";
import { BsShopWindow } from "react-icons/bs";

const HowItWorksSection = () => {
  return (
    <section className="bg-[#F6F8FD] py-[4rem]">
      <div className="px-4 py-3 max-w-7xl mx-auto flex flex-col gap-1 justify-center items-center">
        {/* section title */}
        <h2 className="font-bold text-3xl leading-none tracking-tight mb-8">
          How it Works?
        </h2>
        <div className="mx-auto max-w-7xl px-2 md:px-4 grid md:grid-cols-4 grid-cols-1 gap-3 md:gap-6">
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
