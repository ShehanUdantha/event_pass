import React, { useEffect } from "react";
import Hero from "../sections/HowItWorks/Hero";
import InfoRow from "../sections/HowItWorks/InfoRow";
import VideoInfo from "../sections/HowItWorks/VideoInfo";
import WalletConnectSection from "../sections/HowItWorks/WalletConnectSection";
import CreateEventSection from "../sections/HowItWorks/Organizer/CreateEventSection";
import LaunchTicketsSection from "../sections/HowItWorks/Organizer/LaunchTicketsSection";
import ManageSections from "../sections/HowItWorks/Organizer/ManageSections";
import PromoteEvent from "../sections/HowItWorks/Organizer/PromoteEvent";
import ChooseAEventSection from "../sections/HowItWorks/Buyer/ChooseAEventSection";
import BuyNFTTicketSection from "../sections/HowItWorks/Buyer/BuyNFTTicketSection";
import EnjoySection from "../sections/HowItWorks/Buyer/EnjoySection";

const HowItWorks = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* hero section */}
      <Hero />
      {/* info row */}
      <InfoRow />
      {/* video player */}
      <VideoInfo />
      {/* buyer steps title */}
      <section className="bg-white mt-[3rem] pb-8">
        <div className="flex flex-col md:flex-row mx-auto items-center justify-center max-w-4xl px-4 gap-4 md:gap-6">
          <span className=" text-center font-medium text-[28px] tracking-tight md:text-[45px]">
            4 Easy Steps To Purchase A Ticket
          </span>
        </div>
      </section>
      {/* steps */}
      <WalletConnectSection />
      <ChooseAEventSection />
      <BuyNFTTicketSection />
      <EnjoySection />

      {/* organizer steps title */}
      <section className="bg-white mt-[4rem] pb-8">
        <div className="flex flex-col md:flex-row mx-auto items-center justify-center max-w-4xl px-4 gap-4 md:gap-6">
          <span className="font-medium text-[28px] text-center tracking-tight md:text-[45px]">
            5 Easy Steps To Start A Successful Event
          </span>
        </div>
      </section>
      {/* steps */}
      <WalletConnectSection />
      <CreateEventSection />
      <LaunchTicketsSection />
      <ManageSections />
      <PromoteEvent />
    </div>
  );
};

export default HowItWorks;
