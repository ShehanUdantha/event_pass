import React, { useState } from "react";
import { useStateContext } from "../../context";
import Loader from "../../components/Loader";

const RefundTicketSection = ({ waitingTickets }) => {
  const { contract, address, refundTicket } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);

  const callRefundTicket = async (ticket) => {
    if (contract && address) {
      setIsLoading(true);
      const data = await refundTicket(ticket.eventId, ticket.id);
      console.log(data);
      window.location.reload(false);
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <Loader />}
      <div className="flex justify-center items-start mt-10 text-[14px] h-[50svh]">
        <div className="flex mx-auto justify-center md:justify-start max-w-7xl w-full overflow-auto">
          {waitingTickets.length > 0 ? (
            <table className="text-sm text-left rtl:text-right w-full mx-6 md:mx-12">
              <thead className="text-xs text-white uppercase bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Ticket Id
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Buyer Address
                  </th>

                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Refund</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {waitingTickets.map((ticket, index) => (
                  <tr
                    key={ticket.owner + index}
                    className="bg-[#F6F6F6] border-b border-[#f3f1f1]"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {ticket.id}
                    </th>

                    <th scope="row" className="px-6 py-4 whitespace-nowrap">
                      <p className="w-[5rem] md:w-full text-[14px] text-gray-500 font-medium mt-2 text-ellipsis overflow-hidden">
                        {ticket.owner}
                      </p>
                    </th>

                    <td
                      onClick={() => callRefundTicket(ticket)}
                      className="px-6 py-4 text-right font-medium text-[#4338ca] hover:underline cursor-pointer"
                    >
                      Refund
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center text-[14px] h-[20rem] w-full">
              No Any Tickets Found!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RefundTicketSection;
