import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { eventCategoryList } from "../constants/index";

const EventForm = () => {
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
      .required("Please enter the event start time"),
    startsAtTime: yup.string().required("Please enter the event start time"),
    endsAt: yup
      .date()
      .typeError("Please select the event end date")
      .required("Please enter the event end time"),
    endsAtTime: yup.string().required("Please enter the event end time"),
    location: yup.string().required("Please enter the event location"),
    description: yup.string().required("Please enter the event description"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [selectedCategory, setSelectedCategory] = useState("Other");
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const onSubmit = (data) => {
    console.log(data);
    console.log(selectedCategory);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* event name and image url */}
        <div className="flex flex-col md:flex-row justify-between gap-0 md:gap-16">
          <div className="w-full">
            <p className="text-[14px] font-medium mb-1">Event Title</p>
            <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                type="text"
                placeholder="Enter event title"
                {...register("title")}
              />
            </div>
            <p className="text-[12px] text-red-500">{errors.title?.message}</p>
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
                {...register("imageUrl")}
              />
            </div>
            <p className="text-[12px] text-red-500">
              {errors.imageUrl?.message}
            </p>
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
                {...register("ticketAmount")}
              />
            </div>
            <p className="text-[12px] text-red-500">
              {errors.ticketAmount?.message}
            </p>
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
                {...register("ticketCost")}
              />
            </div>
            <p className="text-[12px] text-red-500">
              {errors.ticketCost?.message}
            </p>
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
                {...register("startsAt")}
              />
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                type="time"
                placeholder="Select start date"
                {...register("startsAtTime")}
              />
            </div>
            <p className="text-[12px] text-red-500">
              {errors.startsAt?.message}
            </p>
            <p className="text-[12px] text-red-500">
              {errors.startsAtTime?.message}
            </p>
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
                {...register("endsAt")}
              />
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                type="time"
                placeholder="Select end date"
                {...register("endsAtTime")}
              />
            </div>
            <p className="text-[12px] text-red-500">{errors.endsAt?.message}</p>
            <p className="text-[12px] text-red-500">
              {errors.endsAtTime?.message}
            </p>
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
                {...register("location")}
              />
            </div>
            <p className="text-[12px] text-red-500">
              {errors.location?.message}
            </p>
          </div>
          <div className="w-full">
            <p className="text-[14px] font-medium mb-1 mt-3 md:mt-0">
              Event Category
            </p>
            <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
              <select
                className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                value={selectedCategory}
                onChange={handleCategoryChange}
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
            {...register("description")}
          />
        </div>
        <p className="text-[12px] text-red-500">
          {errors.description?.message}
        </p>
        {/* submit button */}
        <div className="flex mt-5 text-white justify-center">
          <input
            className="bg-[#4338ca] cursor-pointer px-10 py-2 font-medium rounded hover:bg-[#6366f1] transition-all duration-200 ease-in"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default EventForm;
