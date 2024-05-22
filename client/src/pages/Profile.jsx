import React, { useEffect } from "react";
import HeaderSection from "../sections/Profile/HeaderSection";
import TabSection from "../sections/Profile/TabSection";

const Profile = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* header section */}
      <HeaderSection />
      {/* tab section */}
      <TabSection />
    </div>
  );
};

export default Profile;
