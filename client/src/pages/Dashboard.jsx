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
  calculateTimeAgo,
} from "../utils";
import Spinner from "../assets/images/spinning-dots.svg";
import { FaRegEdit } from "react-icons/fa";
import {
  MdQrCodeScanner,
  MdDeleteOutline,
  MdAttachMoney,
  MdOutlineArrowRightAlt,
  MdOutlinePermMedia,
} from "react-icons/md";
import { IoTicketOutline } from "react-icons/io5";
import { RiUserLine } from "react-icons/ri";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";
import LineChart from "../components/LineChart";
import PageNotFound from "./NotFound";

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
  const notifyRefundRequest = () => toast.error("Refund request remaining");

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

      const filteredDateRageTicket = countTicketsByDate(data, 1);
      setDateRageTickets(filteredDateRageTicket);

      const filteredDateRageVerifiedTicket = countTicketsByDate(
        parsedVerified,
        2
      );
      setDateRageVerifiedTickets(filteredDateRageVerifiedTicket);

      const filteredDateRageRefundRequestedTicket = countTicketsByDate(
        parsedWaitingForRefund,
        3
      );
      setDateRageRefundRequestedTickets(filteredDateRageRefundRequestedTicket);

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
        if (waitingForRefundTickets.length == 0) {
          if (!event.paidOut) {
            setIsLoaderLoading(true);
            const response = await payout(event.id);
            // console.log(response);
            fetchEvent();
            fetchTickets();
            setIsLoaderLoading(false);
          } else {
            notifyEventAlreadyPaid();
          }
        } else {
          notifyRefundRequest();
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
      fetchEvent();
      fetchTickets();
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
            <PageNotFound />
          ) : (
            <div className="bg-[#F6F8FD] pt-32 pb-16 h-full">
              <div className="mx-auto max-w-7xl px-4">
                <main className="w-full min-h-screen transition-all main">
                  {/* first section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                      <div className="flex justify-between mb-6">
                        <div>
                          <div className="text-2xl font-semibold mb-1">
                            {event.ticketAmount - event.ticketRemain}
                          </div>
                          <div className="text-sm font-medium text-gray-400">
                            Sold tickets
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-100 rounded-full h-4">
                          <div
                            className="h-full bg-blue-500 rounded-full p-1"
                            style={{
                              width: `${calculatePercentage(
                                event.ticketAmount,
                                event.ticketAmount - event.ticketRemain
                              )}%`,
                            }}
                          >
                            <div className="w-2 h-2 rounded-full bg-white ml-auto"></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 ml-4">
                          {calculatePercentage(
                            event.ticketAmount,
                            event.ticketAmount - event.ticketRemain
                          )}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                      <div className="flex justify-between mb-4">
                        <div>
                          <div className="flex items-center mb-1">
                            <div className="text-2xl font-semibold">
                              {verifiedTicketsCount}
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-400">
                            Verified Tickets
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                      <div className="flex justify-between mb-6">
                        <div>
                          <div className="text-2xl font-semibold mb-1">
                            <span className="text-base font-normal text-gray-400 align-top mr-2">
                              ETH
                            </span>
                            {convertWeiToEth(event.balance)}
                          </div>
                          <div className="text-sm font-medium text-gray-400">
                            Balance
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center overflow-x-auto">
                        <span className="text-blue-500 font-medium text-sm hover:text-blue-600">
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
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
                      <div className="flex justify-between mb-4 items-start">
                        <div className="font-medium">Event Statistics</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="rounded-md border border-dashed border-gray-200 p-4">
                          <div className="flex items-center mb-0.5">
                            <span className="p-1 rounded text-[12px] font-semibold bg-blue-500/10 text-blue-500 leading-none ml-1">
                              {event.ticketAmount - event.ticketRemain}
                            </span>
                          </div>
                          <span className="text-gray-400 text-sm">Sold</span>
                        </div>
                        <div className="rounded-md border border-dashed border-gray-200 p-4">
                          <div className="flex items-center mb-0.5">
                            <span className="p-1 rounded text-[12px] font-semibold bg-emerald-500/10 text-emerald-500 leading-none ml-1">
                              {verifiedTicketsCount}
                            </span>
                          </div>
                          <span className="text-gray-400 text-sm">
                            Verified
                          </span>
                        </div>
                        <div className="rounded-md border border-dashed border-gray-200 p-4">
                          <div className="flex items-center mb-0.5">
                            <span className="p-1 rounded text-[12px] font-semibold bg-rose-500/10 text-rose-500 leading-none ml-1">
                              {waitingForRefundTickets.length}
                            </span>
                          </div>
                          <span className="text-gray-400 text-sm">
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
                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                      <div className="flex justify-between mb-4 items-start">
                        <div className="font-medium">Manage</div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <tbody>
                            {/* event edit option */}
                            {address == event.owner ? (
                              <tr>
                                <td className="py-2 px-4 border-b border-b-gray-50">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded object-cover bg-gray-200 flex justify-center items-center">
                                      <FaRegEdit className="text-gray-600" />
                                    </div>
                                    <Link
                                      key={event.id + "edit"}
                                      to={"/event/" + event.id + "/edit"}
                                    >
                                      <span className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">
                                        Edit Event
                                      </span>
                                    </Link>
                                  </div>
                                </td>
                                {/* <td className="py-2 px-4 border-b border-b-gray-50">
                              <span className="text-[13px] font-medium text-emerald-500">
                                +$235
                              </span>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                              <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                                Pending
                              </span>
                            </td> */}
                              </tr>
                            ) : null}
                            {/* event withdraw option */}
                            {address == event.owner ? (
                              <tr>
                                <td className="py-2 px-4 border-b border-b-gray-50">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded object-cover bg-gray-200 flex justify-center items-center">
                                      <MdAttachMoney className="text-gray-600" />
                                    </div>
                                    <span
                                      className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate cursor-pointer"
                                      onClick={() => callPayout()}
                                    >
                                      Withdraw Money
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ) : null}

                            <tr>
                              <td className="py-2 px-4 border-b border-b-gray-50">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded object-cover bg-gray-200 flex justify-center items-center">
                                    <MdDeleteOutline className="text-gray-600" />
                                  </div>
                                  <span
                                    className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate cursor-pointer"
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
                                <td className="py-2 px-4 border-b border-b-gray-50">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded object-cover bg-gray-200 flex justify-center items-center">
                                      <MdQrCodeScanner className="text-gray-600" />
                                    </div>
                                    <Link
                                      key={event.id + "scanner"}
                                      to={"/event/" + event.id + "/scanner"}
                                      className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate"
                                    >
                                      <span>Ticket Scanner</span>
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ) : null}
                            {/* event media option */}
                            {address == event.owner ? (
                              <tr>
                                <td className="py-2 px-4 border-b border-b-gray-50">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded object-cover bg-gray-200 flex justify-center items-center">
                                      <MdOutlinePermMedia className="text-gray-600" />
                                    </div>
                                    <Link
                                      key={event.id + "media"}
                                      to={"/event/" + event.id + "/media"}
                                      className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate"
                                    >
                                      <span>Media</span>
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
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                      <div className="flex justify-between mb-4 items-start">
                        <div className="font-medium">Ticket Refunds</div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[540px]">
                          <thead>
                            <tr>
                              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">
                                Ticket Id
                              </th>
                              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">
                                Requested
                              </th>
                              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                Buyer
                              </th>
                              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                {" "}
                              </th>
                              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {waitingForRefundTickets.map((ticket, index) => (
                              <tr key={ticket.owner + index}>
                                <td className="py-2 px-4 border-b border-b-gray-50">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded object-cover bg-gray-200 flex justify-center items-center">
                                      <IoTicketOutline className="text-gray-600" />
                                    </div>
                                    <span className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-4 truncate">
                                      {ticket.id}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-2 px-4 border-b border-b-gray-50">
                                  <span className="text-[13px] font-medium text-gray-400">
                                    {calculateTimeAgo(ticket.refundTimestamp)}
                                  </span>
                                </td>
                                <td className="py-2 px-4 border-b border-b-gray-50">
                                  <span className="text-[13px] font-medium text-gray-400">
                                    {ticket.owner}
                                  </span>
                                </td>
                                <td className="py-2 px-4 border-b border-b-gray-50">
                                  <span
                                    className="text-[13px] font-medium text-[#4338ca] cursor-pointer"
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
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                      <div className="flex justify-between mb-4 items-start">
                        <div className="font-medium">Ticket History</div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[540px]">
                          <thead>
                            <tr>
                              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">
                                Ticket Id
                              </th>
                              <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                Transfers
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {ticketHistory.map((history, index) => (
                              <tr key={history.id + index}>
                                <td className="py-2 px-4 border-b border-b-gray-50">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded object-cover bg-gray-200 flex justify-center items-center">
                                      <RiUserLine className="text-gray-600" />
                                    </div>
                                    <span className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-4 truncate">
                                      {history.id}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-2 px-4 border-b border-b-gray-50">
                                  <div className="flex gap-1 ">
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
