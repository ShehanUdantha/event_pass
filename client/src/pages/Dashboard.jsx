import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import {
  calculatePercentage,
  calculateRemainingTime,
  convertWeiToEth,
  updateTime,
  separateCurrentDateTime,
  getDateList,
  countTicketsByDate,
} from "../utils";
import Spinner from "../assets/images/spinning-dots.svg";
import { FaRegEdit } from "react-icons/fa";
import {
  MdQrCodeScanner,
  MdDeleteOutline,
  MdAttachMoney,
  MdOutlineArrowRightAlt,
} from "react-icons/md";
import { IoTicketOutline } from "react-icons/io5";
import { RiUserLine } from "react-icons/ri";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";
import LineChart from "../components/LineChart";

const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    contract,
    address,
    getSingleEvent,
    getAllTicketsByEvent,
    getEventTicketHistory,
    getContractOwner,
    deleteEvent,
    payout,
    refundTicket,
  } = useStateContext();

  const [isLoaderLoading, setIsLoaderLoading] = useState(false);
  const [isSectionLoading, setIsSectionLoading] = useState(true);
  const [event, setEvent] = useState({});
  const [ticketHistory, setTicketHistory] = useState([]);
  const [verifiedTicketsCount, setVerifiedTicketsCount] = useState(0);
  const [waitingForRefundTickets, setWaitingForRefundTickets] = useState([]);
  const [contractOwner, setContractOwner] = useState("");
  const [remainingTimes, setRemainingTimes] = useState(0);
  const [dateList, setDateList] = useState([]);
  const [dateRageTickets, setDateRageTickets] = useState([]);
  const [dateRageRefundRequestedTickets, setDateRageRefundRequestedTickets] =
    useState([]);
  const [dateRageVerifiedTickets, setDateRageVerifiedTickets] = useState([]);

  const notifyUnAuthorized = () => toast.error("Unauthorized entity");
  const notifyEventAlreadyOnGoing = () => toast.error("Event still ongoing");
  const notifyEventAlreadyPaid = () => toast.error("Event already paid out");

  const fetchEvent = async (contractData) => {
    setIsSectionLoading(true);

    if (!isNaN(+id)) {
      const data = await getSingleEvent(id);
      setEvent(data);
      setIsSectionLoading(false);
      if (data.owner == address || contractData == address) fetchTickets();

      setDateList(getDateList());

      // Start the timer here
      if (data.startsAt) {
        const interval = setInterval(() => {
          setRemainingTimes(calculateRemainingTime(data.startsAt));
        }, 1000);

        return () => clearInterval(interval);
      }
    } else {
      setEvent({ id: 0 });
      setIsSectionLoading(false);
    }
  };

  const fetchTickets = async () => {
    setIsSectionLoading(true);

    if (!isNaN(+id)) {
      const data = await getAllTicketsByEvent(id);

      const parsedVerified = data
        .filter((ticket) => ticket.verified)
        .map((ticket, i) => ticket);

      const parsedWaitingForRefund = data
        .filter((ticket) => ticket.isWaitingForRefund)
        .map((ticket, i) => ticket);

      setVerifiedTicketsCount(parsedVerified.length);
      setWaitingForRefundTickets(parsedWaitingForRefund);

      const filteredDateRageTicket = countTicketsByDate(data);
      setDateRageTickets(filteredDateRageTicket);

      const filteredDateRageRefundRequestedTicket = countTicketsByDate(
        parsedWaitingForRefund
      );
      setDateRageRefundRequestedTickets(filteredDateRageRefundRequestedTicket);

      const filteredDateRageVerifiedTicket = countTicketsByDate(parsedVerified);
      setDateRageVerifiedTickets(filteredDateRageVerifiedTicket);

      setIsSectionLoading(false);
      fetchTicketHistory(data);
    } else {
      setIsSectionLoading(false);
    }
  };

  const fetchTicketHistory = async (ticketsData) => {
    setIsSectionLoading(true);
    setTicketHistory([]);
    for (let i = 0; i < ticketsData.length; i++) {
      const data = await getEventTicketHistory(id, ticketsData[i].id);
      setTicketHistory((prevHistory) => [
        ...prevHistory,
        { id: ticketsData[i].id, owners: data },
      ]);
    }
    setIsSectionLoading(false);
  };

  const callToGetContractOwner = async () => {
    setIsSectionLoading(true);
    const data = await getContractOwner();
    setContractOwner(data);
    fetchEvent(data);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (contract && id) {
      callToGetContractOwner();
    }
  }, [contract, address, id]);

  const callEventDelete = async () => {
    if (address == event.owner || address == contractOwner) {
      setIsLoaderLoading(true);
      const remainingTime = calculateRemainingTime(event.endsAt);
      const response = await deleteEvent(
        event.id,
        remainingTime != "Expired" ? true : false
      );
      setIsLoaderLoading(false);
      if (response) navigate("/");
    } else {
      notifyUnAuthorized();
    }
  };

  const callPayout = async () => {
    const currentDateValue = separateCurrentDateTime();

    if (address == event.owner) {
      if (
        new Date(event.endsAt).getTime() <
        new Date(
          updateTime(currentDateValue.date, currentDateValue.time)
        ).getTime()
      ) {
        if (!event.paidOut) {
          setIsLoaderLoading(true);
          const response = await payout(event.id);
          // console.log(response);
          setIsLoaderLoading(false);
        } else {
          notifyEventAlreadyPaid();
        }
      } else {
        notifyEventAlreadyOnGoing();
      }
    } else {
      notifyUnAuthorized();
    }
  };

  const callRefundTicket = async (ticket) => {
    if (address == event.owner || address == contractOwner) {
      setIsLoaderLoading(true);
      const data = await refundTicket(ticket.eventId, ticket.id);
      // console.log(data);
      window.location.reload(false);
      setIsLoaderLoading(false);
    } else {
      notifyUnAuthorized();
    }
  };

  return (
    <>
      {isLoaderLoading && <Loader />}
      {isSectionLoading ? (
        <div className="flex justify-center items-center text-[14px] h-screen">
          <img
            src={Spinner}
            alt="spinner"
            className="w-[60px] h-[60px] object-contain"
          />
        </div>
      ) : (
        <>
          {event.id === 0 ||
          (event.owner != address && contractOwner != address) ? (
            <div className="flex justify-center items-center text-[14px] h-screen">
              <div className="text-3xl font-bold">Page Not Found</div>
            </div>
          ) : (
            <div className="bg-[#F6F8FD] pt-32 pb-16 h-full">
              <div className="mx-auto max-w-7xl px-4">
                <main class="w-full min-h-screen transition-all main">
                  {/* first section */}
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                      <div class="flex justify-between mb-6">
                        <div>
                          <div class="text-2xl font-semibold mb-1">
                            {event.ticketAmount - event.ticketRemain}
                          </div>
                          <div class="text-sm font-medium text-gray-400">
                            Sold tickets
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center">
                        <div class="w-full bg-gray-100 rounded-full h-4">
                          <div
                            class="h-full bg-blue-500 rounded-full p-1"
                            style={{
                              width: `${calculatePercentage(
                                event.ticketAmount,
                                event.ticketAmount - event.ticketRemain
                              )}%`,
                            }}
                          >
                            <div class="w-2 h-2 rounded-full bg-white ml-auto"></div>
                          </div>
                        </div>
                        <span class="text-sm font-medium text-gray-600 ml-4">
                          {calculatePercentage(
                            event.ticketAmount,
                            event.ticketAmount - event.ticketRemain
                          )}
                          %
                        </span>
                      </div>
                    </div>
                    <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                      <div class="flex justify-between mb-4">
                        <div>
                          <div class="flex items-center mb-1">
                            <div class="text-2xl font-semibold">
                              {verifiedTicketsCount}
                            </div>
                          </div>
                          <div class="text-sm font-medium text-gray-400">
                            Verified Tickets
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                      <div class="flex justify-between mb-6">
                        <div>
                          <div class="text-2xl font-semibold mb-1">
                            <span class="text-base font-normal text-gray-400 align-top mr-2">
                              ETH
                            </span>
                            {convertWeiToEth(event.balance)}
                          </div>
                          <div class="text-sm font-medium text-gray-400">
                            Balance
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center overflow-x-auto">
                        <span class="text-blue-500 font-medium text-sm hover:text-blue-600">
                          Event End In:{" "}
                          <span className="text-gray-400">
                            {remainingTimes != "Expired"
                              ? remainingTimes
                              : "Expired"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* second section */}
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div class="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
                      <div class="flex justify-between mb-4 items-start">
                        <div class="font-medium">Event Statistics</div>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div class="rounded-md border border-dashed border-gray-200 p-4">
                          <div class="flex items-center mb-0.5">
                            <span class="p-1 rounded text-[12px] font-semibold bg-blue-500/10 text-blue-500 leading-none ml-1">
                              {event.ticketAmount - event.ticketRemain}
                            </span>
                          </div>
                          <span class="text-gray-400 text-sm">Sold</span>
                        </div>
                        <div class="rounded-md border border-dashed border-gray-200 p-4">
                          <div class="flex items-center mb-0.5">
                            <span class="p-1 rounded text-[12px] font-semibold bg-emerald-500/10 text-emerald-500 leading-none ml-1">
                              {verifiedTicketsCount}
                            </span>
                          </div>
                          <span class="text-gray-400 text-sm">Verified</span>
                        </div>
                        <div class="rounded-md border border-dashed border-gray-200 p-4">
                          <div class="flex items-center mb-0.5">
                            <span class="p-1 rounded text-[12px] font-semibold bg-rose-500/10 text-rose-500 leading-none ml-1">
                              {waitingForRefundTickets.length}
                            </span>
                          </div>
                          <span class="text-gray-400 text-sm">
                            Refund Request
                          </span>
                        </div>
                      </div>
                      {/* chart section */}
                      <div>
                        <LineChart
                          dateList={dateList}
                          dateRageTickets={dateRageTickets}
                          dateRageVerifiedTicket={dateRageVerifiedTickets}
                          dateRageRefundRequestedTicket={
                            dateRageRefundRequestedTickets
                          }
                        />
                      </div>
                    </div>
                    <div class="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                      <div class="flex justify-between mb-4 items-start">
                        <div class="font-medium">Manage</div>
                      </div>
                      <div class="overflow-x-auto">
                        <table class="w-full">
                          <tbody>
                            {/* event edit option */}
                            {address == event.owner ? (
                              <tr>
                                <td class="py-2 px-4 border-b border-b-gray-50">
                                  <div class="flex items-center">
                                    <div className="w-8 h-8 rounded object-cover bg-gray-200 flex justify-center items-center">
                                      <FaRegEdit className="text-gray-600" />
                                    </div>
                                    <Link
                                      key={event.id + "edit"}
                                      to={"/event/" + event.id + "/edit"}
                                    >
                                      <span class="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">
                                        Edit Event
                                      </span>
                                    </Link>
                                  </div>
                                </td>
                                {/* <td class="py-2 px-4 border-b border-b-gray-50">
                              <span class="text-[13px] font-medium text-emerald-500">
                                +$235
                              </span>
                            </td>
                            <td class="py-2 px-4 border-b border-b-gray-50">
                              <span class="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                                Pending
                              </span>
                            </td> */}
                              </tr>
                            ) : null}
                            {/* event withdraw option */}
                            {address == event.owner ? (
                              <tr>
                                <td class="py-2 px-4 border-b border-b-gray-50">
                                  <div class="flex items-center">
                                    <div className="w-8 h-8 rounded object-cover bg-gray-200 flex justify-center items-center">
                                      <MdAttachMoney className="text-gray-600" />
                                    </div>
                                    <span
                                      class="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate cursor-pointer"
                                      onClick={() => callPayout()}
                                    >
                                      Withdraw Money
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ) : null}

                            <tr>
                              <td class="py-2 px-4 border-b border-b-gray-50">
                                <div class="flex items-center">
                                  <div className="w-8 h-8 rounded object-cover bg-gray-200 flex justify-center items-center">
                                    <MdDeleteOutline className="text-gray-600" />
                                  </div>
                                  <span
                                    class="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate cursor-pointer"
                                    onClick={() => callEventDelete()}
                                  >
                                    Delete Event
                                  </span>
                                </div>
                              </td>
                            </tr>
                            {/* event scanner option */}
                            {address == event.owner ? (
                              <tr>
                                <td class="py-2 px-4 border-b border-b-gray-50">
                                  <div class="flex items-center">
                                    <div className="w-8 h-8 rounded object-cover bg-gray-200 flex justify-center items-center">
                                      <MdQrCodeScanner className="text-gray-600" />
                                    </div>
                                    <Link
                                      key={event.id + "scanner"}
                                      to={"/event/" + event.id + "/scanner"}
                                      class="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate"
                                    >
                                      <a href="#">Ticket Scanner</a>
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ) : null}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* third section */}
                  <div class="grid grid-cols-1 gap-6 mb-6">
                    <div class="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                      <div class="flex justify-between mb-4 items-start">
                        <div class="font-medium">Ticket Refunds</div>
                      </div>
                      <div class="overflow-x-auto">
                        <table class="w-full min-w-[540px]">
                          <thead>
                            <tr>
                              <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">
                                Ticket Id
                              </th>
                              <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                Buyer
                              </th>
                              <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                {" "}
                              </th>
                              <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {waitingForRefundTickets.map((ticket, index) => (
                              <tr key={ticket.owner + index}>
                                <td class="py-2 px-4 border-b border-b-gray-50">
                                  <div class="flex items-center">
                                    <div className="w-8 h-8 rounded object-cover bg-gray-200 flex justify-center items-center">
                                      <IoTicketOutline className="text-gray-600" />
                                    </div>
                                    <span class="text-gray-600 text-sm font-medium hover:text-blue-500 ml-4 truncate">
                                      {ticket.id}
                                    </span>
                                  </div>
                                </td>
                                <td class="py-2 px-4 border-b border-b-gray-50">
                                  <span class="text-[13px] font-medium text-gray-400">
                                    {ticket.owner}
                                  </span>
                                </td>
                                <td class="py-2 px-4 border-b border-b-gray-50">
                                  <span
                                    class="text-[13px] font-medium text-[#4338ca] cursor-pointer"
                                    onClick={() => callRefundTicket(ticket)}
                                  >
                                    Refund
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* fourth section */}
                  <div class="grid grid-cols-1 gap-6 mb-6">
                    <div class="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                      <div class="flex justify-between mb-4 items-start">
                        <div class="font-medium">Ticket History</div>
                      </div>
                      <div class="overflow-x-auto">
                        <table class="w-full min-w-[540px]">
                          <thead>
                            <tr>
                              <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">
                                Ticket Id
                              </th>
                              <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                Transfers
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {ticketHistory.map((history, index) => (
                              <tr key={history.id + index}>
                                <td class="py-2 px-4 border-b border-b-gray-50">
                                  <div class="flex items-center">
                                    <div className="w-8 h-8 rounded object-cover bg-gray-200 flex justify-center items-center">
                                      <RiUserLine className="text-gray-600" />
                                    </div>
                                    <span class="text-gray-600 text-sm font-medium hover:text-blue-500 ml-4 truncate">
                                      {history.id}
                                    </span>
                                  </div>
                                </td>
                                <td class="py-2 px-4 border-b border-b-gray-50">
                                  <div class="flex gap-1 ">
                                    {history.owners.map((owner, index) => (
                                      <div
                                        key={owner + index}
                                        className="flex gap-1 items-center"
                                      >
                                        <div className="w-full flex gap-2 text-[13px] text-gray-400 font-medium text-ellipsis overflow-hidden">
                                          <p className="text-[#444343]">
                                            Owner{index + 1}:
                                          </p>
                                          {owner}
                                        </div>
                                        {index != history.owners.length - 1 ? (
                                          <MdOutlineArrowRightAlt className="mt-[0.2em]" />
                                        ) : null}
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          )}
        </>
      )}
      <Toaster position="bottom-center" />
    </>
  );
};

export default Dashboard;
