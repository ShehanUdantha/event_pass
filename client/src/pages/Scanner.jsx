import React from "react";
import Footer from "../components/Footer";
import HeaderSection from "../sections/Scanner/HeaderSection";
import ScanSection from "../sections/Scanner/ScanSection";

const Scanner = () => {
  return (
    <div>
      {/* header section */}
      <HeaderSection />
      {/* scan section */}
      <ScanSection />
      {/* footer */}
      <Footer />
    </div>
  );
};

export default Scanner;
