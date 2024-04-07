import React, { useEffect } from "react";
import HeaderSection from "../sections/CreateEvent/HeaderSection";
import FormSection from "../sections/CreateEvent/FormSection";

const CreateEvent = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* header section */}
      <HeaderSection title={"Create"} />
      {/* form section */}
      <FormSection />
    </div>
  );
};

export default CreateEvent;
