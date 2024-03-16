import React from "react";
import EventForm from "../../components/EventForm";

const FormSection = ({ event }) => {
  const editEvent = event;
  return (
    <section className="my-10">
      <div className="flex flex-col md:flex-row mx-auto items-center justify-between max-w-7xl px-4">
        <EventForm event={editEvent} />
      </div>
    </section>
  );
};

export default FormSection;
