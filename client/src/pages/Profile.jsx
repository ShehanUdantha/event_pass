import React from "react";
import HeaderSection from "../sections/Profile/HeaderSection";
import TabSection from "../sections/Profile/TabSection";
import Footer from "../components/Footer";

const Profile = () => {
  return (
    <div>
      {/* header section */}
      <HeaderSection />
      {/* tab section */}
      <TabSection />
      {/* footer */}
      <Footer />
    </div>
  );
};

export default Profile;
