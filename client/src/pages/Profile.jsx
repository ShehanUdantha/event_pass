import React, { useEffect } from "react";
import HeaderSection from "../sections/Profile/HeaderSection";
import TabSection from "../sections/Profile/TabSection";
import { useStateContext } from "../context";
import PageNotFound from "./NotFound";

const Profile = () => {
  const { address } = useStateContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {address == undefined ? (
        <PageNotFound />
      ) : (
        <div>
          {/* header section */}
          <HeaderSection />
          {/* tab section */}
          <TabSection />
        </div>
      )}
    </>
  );
};

export default Profile;
