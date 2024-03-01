import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { eventCategoryList } from "../constants/index";
import { ethers } from "ethers";
import { useStateContext } from "../context";
import { checkIfImage, updateTime, separateTime } from "../utils";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const EventForm = ({ event }) => {
  const { createEvent, updateEvent, address } = useStateContext();
  const navigate = useNavigate();

  const notifyNotImage = () => toast.error("Provide valid image URL");
  const notifyEndDateMustBeHigher = () =>
    toast.error("End date must be greater than start date");
  const notifyUnAuthorized = () => toast.error("Unauthorized entity");

  useEffect(() => {
    if (event) setEventDetails();
  }, []);

  const schema = yup.object().shape({
    title: yup.string().required("Please enter the event title"),
    imageUrl: yup.string().required("Please enter the event image url"),
    ticketAmount: yup
      .number("Ticket amount must be a number")
      .typeError("Please enter the event total tickets")
      .positive("Ticket amount must be a positive number")
      .required("Please enter the event total tickets"),
    ticketCost: yup
      .number("Ticket price must be a number")
      .typeError("Please enter the event ticket price")
      .positive("Ticket price must be a positive number")
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

  const [formDetails, setFormDetails] = useState({
    title: "",
    description: "",
    imageUrl: "",
    ticketAmount: 0,
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

    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await schema.validate(formDetails, { abortEarly: false });
      // console.log("Form Submitted", formDetails);
      checkIfImage(formDetails.imageUrl, async (exists) => {
        if (exists) {
          if (
            new Date(
              updateTime(formDetails.endsAt, formDetails.endsAtTime)
            ).getTime() >
            new Date(
              updateTime(formDetails.startsAt, formDetails.startsAtTime)
            ).getTime()
          ) {
            setIsLoading(true);

            if (event) {
              if (address == event.owner) {
                await updateEvent({
                  eventId: event.id,
                  title: formDetails.title,
                  description: formDetails.description,
                  imageUrl: formDetails.imageUrl,
                  ticketAmount: formDetails.ticketAmount,
                  ticketCost: ethers.utils.parseEther(
                    formDetails.ticketCost.toString()
                  ),
                  startsAt: new Date(
                    updateTime(formDetails.startsAt, formDetails.startsAtTime)
                  ).getTime(),
                  endsAt: new Date(
                    updateTime(formDetails.endsAt, formDetails.endsAtTime)
                  ).getTime(),
                  location: formDetails.location,
                  category: formDetails.category,
                });
              } else {
                notifyUnAuthorized();
              }
            } else {
              await createEvent({
                title: formDetails.title,
                description: formDetails.description,
                imageUrl: formDetails.imageUrl,
                ticketAmount: formDetails.ticketAmount,
                ticketCost: ethers.utils.parseEther(
                  formDetails.ticketCost.toString()
                ),
                startsAt: new Date(
                  updateTime(formDetails.startsAt, formDetails.startsAtTime)
                ).getTime(),
                endsAt: new Date(
                  updateTime(formDetails.endsAt, formDetails.endsAtTime)
                ).getTime(),
                location: formDetails.location,
                category: formDetails.category,
              });
            }
            setIsLoading(false);
            navigate("/");
          } else {
            notifyEndDateMustBeHigher();
          }
        } else {
          notifyNotImage();
        }
      });
    } catch (error) {
      const newErrors = {};

      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  // fill input field using edit event details
  const setEventDetails = () => {
    const startedDateObject = new Date(event.startsAt);
    const endedDateObject = new Date(event.endsAt);

    setFormDetails({
      title: event.title,
      description: event.description,
      imageUrl: event.imageUrl,
      ticketAmount: event.ticketAmount,
      ticketCost: event.ticketCost,
      startsAt: startedDateObject.toISOString().split("T")[0],
      startsAtTime: separateTime(startedDateObject),
      endsAt: endedDateObject.toISOString().split("T")[0],
      endsAtTime: separateTime(endedDateObject),
      location: event.location,
      category: event.category,
    });
  };

  return (
    <div className="w-full">
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
          <div className="w-full">
            <p className="text-[14px] font-medium mb-1 mt-3 md:mt-0">
              Event Image
            </p>
            <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                type="text"
                placeholder="Enter event image Url"
                name="imageUrl"
                value={formDetails.imageUrl}
                onChange={handleChange}
              />
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
              Event Ticket Price
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
            <p className="text-[12px] text-red-500">{errors.startsAt}</p>
            <p className="text-[12px] text-red-500">{errors.startsAtTime}</p>
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
            <p className="text-[12px] text-red-500">{errors.endsAt}</p>
            <p className="text-[12px] text-red-500">{errors.endsAtTime}</p>
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
            className="bg-[#4338ca] cursor-pointer px-10 py-2 font-medium rounded hover:bg-[#6366f1] transition-all duration-200 ease-in"
            type="submit"
          />
        </div>
      </form>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default EventForm;
