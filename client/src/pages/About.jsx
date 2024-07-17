import React, { useEffect } from "react";
import Hero from "../sections/About/Hero";
import InfoRow from "../sections/About/InfoRow";
import WhoWeAre from "../sections/About/WhoWeAre";
import OurMissionSection from "../sections/About/OurMissionSection";
import WhyWeDoItSection from "../sections/About/WhyWeDoItSection";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* hero section */}
      <Hero />
      {/* info row */}
      <InfoRow />
      {/* info section */}
      <WhoWeAre />
      <OurMissionSection />
      <WhyWeDoItSection />
    </div>
  );
};

export default About;
