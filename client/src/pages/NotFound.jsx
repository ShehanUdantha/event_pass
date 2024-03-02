import React from "react";
import Footer from "../components/Footer";

const NotFound = () => {
  return (
    <>
      <div className="bg-[#F6F8FD] pt-32 pb-16 h-screen">
        <div className="flex mx-auto items-center justify-center max-w-7xl px-4 h-full">
          <div className="text-3xl font-bold">Page Not Found</div>
        </div>
      </div>
      {/* footer */}
      <Footer />
    </>
  );
};

export default NotFound;
