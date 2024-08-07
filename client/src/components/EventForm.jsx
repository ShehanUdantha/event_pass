import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { eventCategoryList } from "../constants/index";
import { ethers } from "ethers";
import { useStateContext } from "../context";
import { updateTime, separateTime } from "../utils";
import { uploadFileToIPFS } from "../services/pinata";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Loader from "./Loader";

const EventForm = ({ event }) => {
  const { createEvent, updateEvent, address, connect } = useStateContext();
  const navigate = useNavigate();

  const notifyEndDateMustBeHigher = () =>
    toast.error("End date must be greater than start date");
  const notifyValidStartDate = () => toast.error("Provide valid start date");
  const notifyUnAuthorized = () => toast.error("Unauthorized entity");
  const notifyConnectWallet = () => toast.error("Please connect your wallet");
  const notifySomethingWrong = () => toast.error("Something went wrong!");

  useEffect(() => {
    if (event) setEventDetails();
  }, [event]);

  const schema = yup.object().shape({
    title: yup.string().required("Please enter the event title"),
    imageUrl: yup.string().required("Please select the image"),
    ticketAmount: yup
      .number("Ticket amount must be a number")
      .typeError("Please enter the event total tickets")
      .positive("Ticket amount must be a positive number")
      .required("Please enter the event total tickets"),
    ticketCost: yup
      .number("Ticket price must be a number")
      .positive("Ticket cost must be a positive number")
      .typeError("Please enter the event ticket price")
      .required("Please enter the event ticket price"),
    startsAt: yup
      .date()
      .typeError("Please select the event start date")
      .required("Please enter the event start date"),
    startsAtTime: yup.string().required("Please enter the event start time"),
    endsAt: yup
      .date()
      .typeError("Please select the event end date")
      .required("Please enter the event end date"),
    endsAtTime: yup.string().required("Please enter the event end time"),
    location: yup.string().required("Please enter the event location"),
    description: yup.string().required("Please enter the event description"),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickImage, setPickImage] = useState("");
  const [trackImage, setTrackImage] = useState("");

  const [formDetails, setFormDetails] = useState({
    title: "",
    description: "",
    imageUrl: "",
    ticketAmount: 0,
    ticketPreviousAmount: 0,
    ticketCost: 0,
    startsAt: "",
    startsAtTime: "",
    endsAt: "",
    endsAtTime: "",
    location: "",
    category: "Other",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name == "imageUrl") {
      setFormDetails({
        ...formDetails,
        [name]: e.target.files[0].name,
      });
      setPickImage(e.target.files[0]);
    } else {
      setFormDetails({
        ...formDetails,
        [name]: value,
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // If submitting, do nothing
    if (isSubmitting) return;

    // Start submitting
    setIsSubmitting(true);

    try {
      // Validation
      await schema.validate(formDetails, { abortEarly: false });

      // Check if start date is valid
      const startDate = new Date(
        updateTime(formDetails.startsAt, formDetails.startsAtTime)
      ).getTime();
      const endDate = new Date(
        updateTime(formDetails.endsAt, formDetails.endsAtTime)
      ).getTime();

      if (startDate > new Date().getTime()) {
        if (endDate > startDate) {
          if (event) {
            // Update existing event
            if (event && address !== null && address === event.owner) {
              await handleEventSubmission(startDate, endDate, "update");
            } else {
              notifyUnAuthorized();
            }
          } else {
            // Create new event
            if (address !== null) {
              await handleEventSubmission(startDate, endDate, "add");
            } else {
              connect();
              notifyConnectWallet();
            }
          }
        } else {
          notifyEndDateMustBeHigher();
        }
      } else {
        notifyValidStartDate();
      }
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    } finally {
      // Reset submitting state after 3 seconds
      setTimeout(() => {
        setIsSubmitting(false);
      }, 3000);
    }
  };

  const handleEventSubmission = async (startDate, endDate, status) => {
    setIsLoading(true);

    let uploadUrl;
    try {
      if (trackImage !== pickImage && pickImage !== "") {
        const response = await uploadFileToIPFS(
          pickImage,
          "event",
          `${pickImage.name}`
        );
        if (response.success === true) {
          uploadUrl = response.pinataURL;
        } else {
          console.error("Error uploading image:", response.message);
          throw new Error(response.message);
        }
      } else {
        uploadUrl = formDetails.imageUrl;
      }

      const amountWei = ethers.utils.parseEther(
        formDetails.ticketCost.toString()
      );

      // console.log("Amount in Wei:", amountWei.toString());

      const response =
        status === "update"
          ? await updateEvent({
              eventId: event.id,
              title: formDetails.title,
              description: formDetails.description,
              imageUrl: uploadUrl,
              ticketAmount: formDetails.ticketAmount,
              ticketRemain:
                formDetails.ticketAmount > formDetails.ticketPreviousAmount
                  ? event.ticketRemain +
                    (formDetails.ticketAmount -
                      formDetails.ticketPreviousAmount)
                  : event.ticketRemain -
                    (formDetails.ticketPreviousAmount -
                      formDetails.ticketAmount),
              ticketCost: ethers.utils.parseEther(
                formDetails.ticketCost.toString()
              ),
              startsAt: startDate,
              endsAt: endDate,
              location: formDetails.location,
              category: formDetails.category,
            })
          : await createEvent({
              title: formDetails.title,
              description: formDetails.description,
              imageUrl: uploadUrl,
              ticketAmount: formDetails.ticketAmount,
              ticketCost: ethers.utils.parseEther(
                formDetails.ticketCost.toString()
              ),
              startsAt: startDate,
              endsAt: endDate,
              location: formDetails.location,
              category: formDetails.category,
            });

      setIsLoading(false);
      if (response) navigate("/");
    } catch (error) {
      console.error("Error handling event submission:", error);
      setIsLoading(false);
      notifySomethingWrong();
    }
  };

  // fill input field using edit event details
  const setEventDetails = () => {
    const startedDateObject = new Date(event.startsAt);
    const endedDateObject = new Date(event.endsAt);
    setTrackImage(event.imageUrl);

    setFormDetails({
      title: event.title,
      description: event.description,
      imageUrl: event.imageUrl,
      ticketAmount: event.ticketAmount,
      ticketPreviousAmount: event.ticketAmount,
      ticketCost: event.ticketCost,
      startsAt:
        event.startsAt != null
          ? startedDateObject.toISOString().split("T")[0]
          : "",
      startsAtTime:
        event.startsAt != null ? separateTime(startedDateObject) : "",
      endsAt:
        event.endsAt != null ? endedDateObject.toISOString().split("T")[0] : "",
      endsAtTime: event.endsAt != null ? separateTime(endedDateObject) : "",
      location: event.location,
      category: event.category,
    });
  };

  return (
    <div className="w-full">
      {isLoading && <Loader />}
      <form onSubmit={onSubmit}>
        {/* event name and image url */}
        <div className="flex flex-col md:flex-row justify-between gap-0 md:gap-16">
          <div className="w-full">
            <p className="text-[14px] font-medium mb-1">Event Title</p>
            <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                type="text"
                placeholder="Enter event title"
                name="title"
                value={formDetails.title}
                onChange={handleChange}
              />
            </div>
            <p className="text-[12px] text-red-500">{errors.title}</p>
          </div>
          {/* event image */}
          <div className="w-full">
            <p className="text-[14px] font-medium mb-1 mt-3 md:mt-0">
              Event Image
            </p>
            <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2 flex justify-between items-center">
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                type="file"
                name="imageUrl"
                accept="image/*"
                onChange={handleChange}
              />
              {trackImage !== pickImage && pickImage !== "" ? null : (
                <input
                  className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                  type="text"
                  defaultValue={formDetails.imageUrl}
                />
              )}
            </div>
            <p className="text-[12px] text-red-500">{errors.imageUrl}</p>
          </div>
        </div>
        {/* event total tickets and cost */}
        <div className="flex flex-col md:flex-row justify-between gap-0 md:gap-16 mt-3 md:mt-5">
          <div className="w-full">
            <p className="text-[14px] font-medium mb-1">Total Tickets</p>
            <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                type="number"
                placeholder="Enter event total tickets"
                name="ticketAmount"
                value={formDetails.ticketAmount}
                onChange={handleChange}
              />
            </div>
            <p className="text-[12px] text-red-500">{errors.ticketAmount}</p>
          </div>
          <div className="w-full">
            <p className="text-[14px] font-medium mb-1 mt-3 md:mt-0">
              Event Ticket Price (ETH)
            </p>
            <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                type="number"
                placeholder="Enter event ticket price"
                name="ticketCost"
                value={formDetails.ticketCost}
                onChange={handleChange}
              />
            </div>
            <p className="text-[12px] text-red-500">{errors.ticketCost}</p>
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
                placeholder="Select start date"
                name="startsAt"
                value={formDetails.startsAt}
                onChange={handleChange}
              />
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                type="time"
                placeholder="Select start time"
                name="startsAtTime"
                value={formDetails.startsAtTime}
                onChange={handleChange}
              />
            </div>
            <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-center md:gap-5">
              <p className="text-[12px] text-red-500">{errors.startsAt}</p>
              <p className="text-[12px] text-red-500">{errors.startsAtTime}</p>
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
                placeholder="Select end date"
                name="endsAt"
                value={formDetails.endsAt}
                onChange={handleChange}
              />
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                type="time"
                placeholder="Select end time"
                name="endsAtTime"
                value={formDetails.endsAtTime}
                onChange={handleChange}
              />
            </div>
            <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-center md:gap-5">
              <p className="text-[12px] text-red-500">{errors.endsAt}</p>
              <p className="text-[12px] text-red-500">{errors.endsAtTime}</p>
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
                placeholder="Enter event location"
                name="location"
                value={formDetails.location}
                onChange={handleChange}
              />
            </div>
            <p className="text-[12px] text-red-500">{errors.location}</p>
          </div>
          <div className="w-full">
            <p className="text-[14px] font-medium mb-1 mt-3 md:mt-0">
              Event Category
            </p>
            <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
              <select
                className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                name="category"
                value={formDetails.category}
                onChange={handleChange}
              >
                {eventCategoryList.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* event description */}
        <p className="text-[14px] font-medium mb-1 mt-3 md:mt-5">
          Event description
        </p>
        <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
          <textarea
            className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
            placeholder="Enter event description"
            rows={4}
            cols={40}
            name="description"
            value={formDetails.description}
            onChange={handleChange}
          />
        </div>
        <p className="text-[12px] text-red-500">{errors.description}</p>
        {/* submit button */}
        <div className="flex mt-5 text-white justify-center">
          <input
            className="text-[1.01rem] cursor-pointer font-semibold w-[8rem] h-[2.8rem] border rounded-3xl flex justify-center items-center text-white bg-[#4338ca] hover:bg-[#6366f1] transition hover:-translate-y-1 hover:scale-105 duration-900"
            type="submit"
            disabled={isSubmitting}
          />
        </div>
      </form>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default EventForm;
