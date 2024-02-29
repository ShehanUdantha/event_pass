import React from "react";
import HeaderSection from "../sections/CreateEvent/HeaderSection";
import FormSection from "../sections/CreateEvent/FormSection";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";

const EditEvent = () => {
  const location = useLocation();
  const event = location.state.editEventDetails;
  return (
    <div>
      {/* header section */}
      <HeaderSection title={"Edit"} />
      {/* form section */}
      <FormSection event={event} />
      {/* footer */}
      <Footer />
    </div>
  );
};

export default EditEvent;
