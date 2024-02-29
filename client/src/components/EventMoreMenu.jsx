import React from "react";
import { Link } from "react-router-dom";

const EventMoreMenu = ({ event }) => {
  return (
    <div className="flex flex-col absolute w-[100px] p-[15px] bg-white border-spacing-1 right-[1.5rem] md:right-[4rem] border border-gray">
      <ul className="flex flex-col gap-4 text-[12px]">
        <Link
          key={event.id}
          to={"/event/" + event.id + "/edit"}
          state={{ editEventDetails: event }}
        >
          <li className="border-b cursor-pointer">Edit</li>
        </Link>
        <li className="border-b cursor-pointer">Payout</li>
        <li className="border-b cursor-pointer">Delete</li>
      </ul>
    </div>
  );
};

export default EventMoreMenu;
