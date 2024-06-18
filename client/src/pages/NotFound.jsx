import React, { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="bg-white pt-32 pb-16 h-screen">
        <div className="flex mx-auto items-center justify-center max-w-7xl px-4 h-full">
          <div className="text-3xl font-bold">Page Not Found</div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
