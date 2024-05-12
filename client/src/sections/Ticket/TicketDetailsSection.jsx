import React from "react";
import { separateTime } from "../../utils/index";

const TicketDetailsSection = ({ event, ticket }) => {
  const startedDateObject = new Date(event.startsAt);
  const endedDateObject = new Date(event.endsAt);

  return (
    <section className="my-10" onContextMenu={(e) => e.preventDefault()}>
      <div className="flex flex-col md:flex-row mx-auto items-center justify-between max-w-7xl px-4">
        <div className="w-full">
          <form>
            {/* event name and ticket price */}
            <div className="flex flex-col md:flex-row justify-between gap-0 md:gap-16">
              <div className="w-full">
                <p className="text-[14px] font-medium mb-1">Event Name</p>
                <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
                  <input
                    className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                    type="text"
                    disabled={true}
                    value={event.title}
                  />
                </div>
              </div>
              <div className="w-full">
                <p className="text-[14px] font-medium mb-1 mt-3 md:mt-0">
                  Ticket Price
                </p>
                <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
                  <input
                    className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                    type="text"
                    disabled={true}
                    value={event.ticketCost}
                  />
                </div>
              </div>
            </div>
            {/* event started date and end date */}
            <div className="flex flex-col md:flex-row justify-between gap-0 md:gap-16 mt-3 md:mt-5">
              <div className="w-full">
                <p className="text-[14px] font-medium mb-1">
                  Event Start Date and Time
                </p>
                <div className="min-h-[40px] flex justify-between items-center gap-3 rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
                  <input
                    className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                    type="date"
                    disabled={true}
                    value={
                      event.startsAt != null
                        ? startedDateObject.toISOString().split("T")[0]
                        : ""
                    }
                  />
                  <input
                    className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                    type="time"
                    disabled={true}
                    value={
                      event.startsAt != null
                        ? separateTime(startedDateObject)
                        : ""
                    }
                  />
                </div>
              </div>
              <div className="w-full">
                <p className="text-[14px] font-medium mb-1 mt-3 md:mt-0">
                  Event End Date and Time
                </p>
                <div className="min-h-[40px] flex justify-between items-center gap-3 rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
                  <input
                    className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                    type="date"
                    disabled={true}
                    value={
                      event.endsAt != null
                        ? endedDateObject.toISOString().split("T")[0]
                        : ""
                    }
                  />
                  <input
                    className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                    type="time"
                    disabled={true}
                    value={
                      event.endsAt != null ? separateTime(endedDateObject) : ""
                    }
                  />
                </div>
              </div>
            </div>
            {/* event location and category */}
            <div className="flex flex-col md:flex-row justify-between gap-0 md:gap-16 mt-3 md:mt-5">
              <div className="w-full">
                <p className="text-[14px] font-medium mb-1">Event Location</p>
                <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
                  <input
                    className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                    type="text"
                    disabled={true}
                    value={event.location}
                  />
                </div>
              </div>
              <div className="w-full">
                <p className="text-[14px] font-medium mb-1">Event Category</p>
                <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
                  <input
                    className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                    type="text"
                    disabled={true}
                    value={event.category}
                  />
                </div>
              </div>
            </div>
            {/* owner and isVerified */}
            <div className="flex flex-col md:flex-row justify-between gap-0 md:gap-16 mt-3 md:mt-5">
              <div className="w-full">
                <p className="text-[14px] font-medium mb-1">Ticket Owner</p>
                <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
                  <input
                    className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                    type="text"
                    disabled={true}
                    value={ticket.owner}
                  />
                </div>
              </div>
              <div className="w-full">
                <p className="text-[14px] font-medium mb-1">Is Verified</p>
                <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
                  <input
                    className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                    type="text"
                    disabled={true}
                    value={ticket.verified ? "True" : "False"}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TicketDetailsSection;
