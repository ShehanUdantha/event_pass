import React from "react";
import HeaderSection from "../sections/CreateEvent/HeaderSection";
import FormSection from "../sections/CreateEvent/FormSection";
import Footer from "../components/Footer";

const CreateEvent = () => {
  return (
    <div>
      {/* header section */}
      <HeaderSection title={"Create"} />
      {/* form section */}
      <FormSection />
      {/* footer */}
      <Footer />
    </div>
  );
};

export default CreateEvent;
