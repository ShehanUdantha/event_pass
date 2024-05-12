import React, { useEffect } from "react";
import Header from "../components/Header";
import FormSection from "../sections/Event/FormSection";

const CreateEvent = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* header section */}
      <Header title={"Create Event"} />
      {/* form section */}
      <FormSection />
    </div>
  );
};

export default CreateEvent;
