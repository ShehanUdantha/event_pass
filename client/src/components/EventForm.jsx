import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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
      .typeError("Please select the event started date")
      .required("Please enter the event started time"),
    endsAt: yup
      .date()
      .typeError("Please select the event end date")
      .required("Please enter the event end time"),
    description: yup.string().required("Please enter the event description"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* event name and image url */}
        <div className="flex flex-col md:flex-row justify-between gap-0 md:gap-16">
          <div className="w-full">
            <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6]  w-full text-gray-900 focus:outline-none"
                type="text"
                placeholder="Event title"
                {...register("title")}
              />
            </div>
            <p className="text-[12px] text-red-500">{errors.title?.message}</p>
          </div>
          <div className="w-full">
            <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2 mt-5 md:mt-0">
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6]  w-full text-gray-900 focus:outline-none"
                type="text"
                placeholder="Event image Url"
                {...register("imageUrl")}
              />
            </div>
            <p className="text-[12px] text-red-500">
              {errors.imageUrl?.message}
            </p>
          </div>
        </div>
        {/* event total tickets and cost */}
        <div className="flex flex-col md:flex-row justify-between gap-0 md:gap-16 mt-5">
          <div className="w-full">
            <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6]  w-full text-gray-900 focus:outline-none"
                type="number"
                placeholder="Total tickets"
                {...register("ticketAmount")}
              />
            </div>
            <p className="text-[12px] text-red-500">
              {errors.ticketAmount?.message}
            </p>
          </div>
          <div className="w-full">
            <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2 mt-5 md:mt-0">
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6]  w-full text-gray-900 focus:outline-none"
                type="number"
                placeholder="Ticket price"
                {...register("ticketCost")}
              />
            </div>
            <p className="text-[12px] text-red-500">
              {errors.ticketCost?.message}
            </p>
          </div>
        </div>
        {/* event started date and end date */}
        <div className="flex flex-col md:flex-row justify-between gap-0 md:gap-16 mt-5">
          <div className="w-full">
            <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2">
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6]  w-full text-gray-900 focus:outline-none"
                type="date"
                placeholder="Select started date"
                {...register("startsAt")}
              />
            </div>
            <p className="text-[12px] text-red-500">
              {errors.startsAt?.message}
            </p>
          </div>
          <div className="w-full">
            <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2 mt-5 md:mt-0">
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6]  w-full text-gray-900 focus:outline-none"
                type="date"
                placeholder="Select end date"
                {...register("endsAt")}
              />
            </div>
            <p className="text-[12px] text-red-500">{errors.endsAt?.message}</p>
          </div>
        </div>
        {/* event description */}
        <div className="min-h-[40px] rounded-2xl w-full bg-[#F6F6F6] px-4 py-2 mt-5">
          <textarea
            className="bg-[#F6F6F6] border border-[#F6F6F6]  w-full text-gray-900 focus:outline-none"
            placeholder="Event description"
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
