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
import TitleSection from "../sections/HowItWorks/TitleSection";

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
      <TitleSection title={"4 Easy Steps To Purchase A Ticket"} />
      {/* steps */}
      <WalletConnectSection isTicket={true} />
      <ChooseAEventSection />
      <BuyNFTTicketSection />
      <EnjoySection />

      {/* organizer steps title */}
      <TitleSection title={"5 Easy Steps To Start A Successful Event"} />
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
