import React from "react";
import toast, { Toaster } from "react-hot-toast";
import Loader from "./Loader";

const TicketMoreMenu = ({ eventId, ticket }) => {
  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col absolute w-[100px] p-[15px] bg-white border-spacing-1 right-[1.5rem] md:right-[4rem] border border-gray">
        <ul className="flex flex-col gap-4 text-[12px]">
          <li onClick={callEventDelete} className="border-b cursor-pointer">
            Resell
          </li>
        </ul>
        <Toaster position="bottom-right" />
      </div>
    </>
  );
};

export default TicketMoreMenu;
