import React from "react";
import Socials from "../../assets/images/socialMedia.png";
import { Sms, Instagram } from "iconsax-react";

const SocialSection = () => {
  return (
    <section className="bg-white py-[4rem] px-5 md:px-0">
      <div className="max-w-4xl h-[50rem] md:h-[33rem] overflow-hidden border rounded-3xl mx-auto flex flex-col md:flex-row gap-1 justify-center items-center">
        <div className="w-full h-full p-12 md:p-14">
          <span className="max-w-sm font-semibold text-[25px] leading-none tracking-tight md:text-[38px]">
            Promote Events And Increase Your Reach
          </span>
          <div className="pt-5 justify-center md:justify-start">
            <span className="max-w-sm text-[1.01rem] font-normal leading-none tracking-tight text-gray-500">
              Your event deserves the spotlight. With cutting-edge marketing
              tools spanning from Google to TikTok, and our special touch of
              promotion, watch as your event ripples across the digital
              landscape, drawing attendees like never before.
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 pt-5">
            <div className="flex justify-start items-center gap-3">
              <div className="bg-gray-100 rounded-full flex items-center justify-center w-8 h-8">
                <Sms size={19} />
              </div>
              <span className="text-[1.01rem] font-semibold">Newsletters</span>
            </div>

            <div className="flex justify-start items-center gap-3">
              <div className="bg-gray-100 rounded-full flex items-center justify-center w-8 h-8">
                <Instagram size={19} />
              </div>
              <span className="text-[1.01rem] font-semibold">
                Social networks
              </span>
            </div>
          </div>

          <div className="mt-[4rem] w-[8.3rem] h-[3rem] border rounded-3xl flex justify-center items-center cursor-pointer">
            <span className="text-[1.01rem] font-semibold">Start Today</span>
          </div>
        </div>
        <div className="w-full h-full">
          <img
            src={Socials}
            alt="socials"
            className="w-full h-full object-cover rounded-bl-3xl rounded-br-3xl md:rounded-bl-[0px] md:rounded-tr-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default SocialSection;
