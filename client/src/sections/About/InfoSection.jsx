import React from "react";

const InfoSection = () => {
  return (
    <section className="pt-10 pb-16 h-screen">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="font-semibold text-[24px] leading-none tracking-tight mb-5">
          We're EventPass
        </h2>
        <span className="max-w-sm text-[1.1rem] leading-none text-gray-light/80 tracking-tight">
          We provide a ticketing platform for event organizers. Our self-service
          cloud software lets organizers take online payments, sell tickets,
          manage customers and much more beyond. We handle customer service,
          on-site event support and we help our organizers advertise and market
          their events.
        </span>
        <h2 className="font-semibold text-[24px] leading-none tracking-tight mt-8 mb-5">
          Our Mission
        </h2>
        <span className="max-w-sm text-[1.1rem] leading-none text-gray-light/80 tracking-tight">
          EventPass's mission is to become the most fundamental platform for
          experiences, add long term value to our clients and make a lasting
          positive impact to our planet.
        </span>
        <h2 className="font-semibold text-[24px] leading-none tracking-tight mt-8 mb-5">
          Why We Do It
        </h2>
        <span className="max-w-sm text-[1.1rem] leading-none text-gray-light/80 tracking-tight">
          We believe ticketing can be done better. Elegantly designed, stress
          free, fair and ethical. We focus on long term impact over short term
          profits. We’re here for long-term sustainable growth of our company,
          our clients' events, our employees, and our ever-growing forest of
          trees.
        </span>
      </div>
    </section>
  );
};

export default InfoSection;
