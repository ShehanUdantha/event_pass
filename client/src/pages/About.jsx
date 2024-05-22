import React, { useEffect } from "react";
import Header from "../components/Header";
import InfoSection from "../sections/About/InfoSection";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* header section */}
      <Header title={"About Us"} />
      {/* info section */}
      <InfoSection />
    </div>
  );
};

export default About;
