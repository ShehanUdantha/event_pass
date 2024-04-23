import React, { useEffect } from "react";
import HeaderSection from "../sections/About/HeaderSection";
import InfoSection from "../sections/About/InfoSection";

export const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* header section */}
      <HeaderSection />
      {/* info section */}
      <InfoSection />
    </div>
  );
};
