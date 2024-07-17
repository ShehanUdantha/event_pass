import React, { useEffect } from "react";
import Hero from "../sections/Home/Hero";
import ChatWootWidget from "../widgets/ChatWootWidget";
import SocialSection from "../sections/Home/SocialSection";
import StartEventSection from "../sections/Home/StartEventSection";
import AudienceSection from "../sections/Home/AudienceSection";
import InfoRow from "../sections/Home/InfoRow";
import BuyTicketsSection from "../sections/Home/BuyTicketsSection";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* hero section */}
      <Hero />
      {/* info row */}
      <InfoRow />
      {/* buy tickets */}
      <BuyTicketsSection />
      {/* promote events */}
      <SocialSection />
      {/* start new event */}
      <StartEventSection />
      {/* audience */}
      <AudienceSection />
      {/* chatwoot */}
      <ChatWootWidget />
    </div>
  );
};

export default Home;
