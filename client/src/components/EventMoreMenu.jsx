import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../context";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Loader from "./Loader";

const EventMoreMenu = ({ event }) => {
  const { address, deleteEvent } = useStateContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const notifyUnAuthorized = () => toast.error("Unauthorized entity");

  const callEventDelete = async () => {
    if (address == event.owner) {
      setIsLoading(true);
      const response = await deleteEvent(event.id);
      setIsLoading(false);
      if (response) navigate("/");
    } else {
      notifyUnAuthorized();
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col absolute w-[100px] p-[15px] bg-white border-spacing-1 right-[1.5rem] md:right-[4rem] border border-gray">
        <ul className="flex flex-col gap-4 text-[12px]">
          <Link key={event.id} to={"/event/" + event.id + "/edit"}>
            <li className="border-b cursor-pointer">Edit</li>
          </Link>
          <li className="border-b cursor-pointer">Payout</li>
          <li onClick={callEventDelete} className="border-b cursor-pointer">
            Delete
          </li>
        </ul>
        <Toaster position="bottom-right" />
      </div>
    </>
  );
};

export default EventMoreMenu;
