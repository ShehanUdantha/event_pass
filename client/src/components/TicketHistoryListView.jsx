import React from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";

const TicketHistoryListView = ({ ticketHistory }) => {
  return (
    <section className="my-10">
      {ticketHistory != null && ticketHistory.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 flex flex-col">
          {ticketHistory.map((history, index) => (
            <div key={history + index} className="pb-3">
              <div className="font-bold">Ticket Id: {history.id}</div>

              <div className="flex gap-5 overflow-y-auto">
                {history.owners.map((owner, index) => (
                  <div key={owner + index} className="flex gap-1 items-center">
                    <div className="w-full flex gap-2 text-[13px] text-gray-500 font-medium text-ellipsis overflow-hidden">
                      <p className="text-[#444343]">Owner{index + 1}:</p>
                      {owner}
                    </div>
                    <MdOutlineArrowRightAlt className="mt-[0.2em]" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center text-[14px] h-[20rem]">
          No Any Events Found!
        </div>
      )}
    </section>
  );
};

export default TicketHistoryListView;
