import React, { useState } from "react";
import Hero from "../sections/Home/Hero";
import Filter from "../sections/Home/FilterSection";
import GridView from "../sections/Home/GridViewSection";
import PaginationSection from "../sections/Home/PaginationSection";
import Footer from "../components/Footer";

const Home = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Event 1",
      imageUrl:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      owner: "0xAbCdEf0123456789abcdef0123456789abcdef01",
      ticketCost: 10,
      ticketAmount: 500,
      ticketRemain: 400,
      startsAt: "04/01/2024 03:30 PM",
      endsAt: "04/17/2024",
      location: "Venue 1",
      timestamp: 1645602456,
      category: "category1",
      deleted: false,
      paidOut: true,
      refunded: false,
      minted: true,
    },
    {
      id: 2,
      title: "Event 2",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1672354234377-38ef695dd2ed?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      owner: "0x0123456789abcdef0123456789abcdef01234567",
      ticketCost: 15,
      ticketAmount: 300,
      ticketRemain: 150,
      startsAt: "04/21/2024 03:30 PM",
      endsAt: "04/21/2024",
      location: "Venue 2",
      timestamp: 1645602456,
      category: "category2",
      deleted: false,
      paidOut: false,
      refunded: false,
      minted: true,
    },
    {
      id: 3,
      title: "Event 3",
      imageUrl:
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      owner: "0x3456789abcdef0123456789abcdef01234567012",
      ticketCost: 20,
      ticketAmount: 200,
      ticketRemain: 100,
      startsAt: "05/17/2024 03:30 PM",
      endsAt: "05/13/2024",
      location: "Venue 3",
      timestamp: 1645602456,
      category: "category3",
      deleted: false,
      paidOut: false,
      refunded: true,
      minted: false,
    },
  ]);
  return (
    <div>
      {/* hero section */}
      <Hero />
      {/* filter section */}
      <Filter />
      {/* grid view */}
      <GridView events={events} />
      {/* pagination section */}
      <PaginationSection />
      {/* footer */}
      <Footer />
    </div>
  );
};

export default Home;
