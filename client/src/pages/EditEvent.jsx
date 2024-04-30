import React, { useState, useEffect } from "react";
import HeaderSection from "../sections/CreateEvent/HeaderSection";
import FormSection from "../sections/CreateEvent/FormSection";
import { useParams } from "react-router-dom";
import { useStateContext } from "../context";
import Spinner from "../assets/images/spinning-dots.svg";

const EditEvent = () => {
  const { id } = useParams();
  const { contract, address, getSingleEvent } = useStateContext();

  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvent = async () => {
    setIsLoading(true);

    if (!isNaN(+id)) {
      const data = await getSingleEvent(id);
      if (address == data.owner) {
        setEvent(data);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (contract && id) fetchEvent();
  }, [contract, address]);

  // console.log(event);

  return (
    <div>
      {/* header section */}
      <HeaderSection title={"Edit"} />
      {/* form section */}
      {isLoading ? (
        <div className="flex justify-center items-center text-[14px] h-[20rem]">
          <img
            src={Spinner}
            alt="spinner"
            className="w-[60px] h-[60px] object-contain"
          />
        </div>
      ) : (
        <FormSection event={event} />
      )}
    </div>
  );
};

export default EditEvent;
