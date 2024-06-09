import React, { useEffect } from "react";
import Header from "../components/Header";
import FormSection from "../sections/Event/FormSection";
import { useStateContext } from "../context";
import PageNotFound from "./NotFound";

const CreateEvent = () => {
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
          <Header title={"Create Event"} />
          {/* form section */}
          <FormSection />
        </div>
      )}
    </>
  );
};

export default CreateEvent;
