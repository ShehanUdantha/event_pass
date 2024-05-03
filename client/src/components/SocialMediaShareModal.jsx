import React from "react";
import { IoClose, IoCopyOutline } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import {
  EmailIcon,
  FacebookIcon,
  PinterestIcon,
  RedditIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

const SocialMediaShareModal = ({ url, onClose }) => {
  const notifyUrlCopied = () => toast.success("Copied the event url!");

  const clickUrlCopyFunction = () => {
    navigator.clipboard.writeText(url);

    notifyUrlCopied();
  };

  return (
    <>
      <div className="fixed inset-0 z-30 h-screen px-4 bg-[#000000b3] backdrop-blur-sm flex items-center justify-center">
        <div className="w-[600px] flex flex-col bg-white p-6 rounded-xl">
          {/* modal close button */}
          <IoClose
            onClick={() => onClose()}
            className="text-black place-self-end mb-1 cursor-pointer"
          />

          <div className="w-full">
            <p className="text-[14px] font-medium mb-1">Social Media Sharing</p>
            {/* url copy section */}
            <div className="min-h-[40px] flex justify-between items-center gap-3 rounded-2xl w-full bg-[#F6F6F6] px-4 py-2 mt-3">
              <input
                className="bg-[#F6F6F6] border border-[#F6F6F6] text-[14px] w-full text-gray-900 focus:outline-none"
                type="text"
                disabled={true}
                value={url}
                id="urlInput"
              />
              <IoCopyOutline
                onClick={() => clickUrlCopyFunction()}
                className="cursor-pointer text-lg"
              />
            </div>

            {/* social media sharing */}
            <div className="w-full grid grid-cols-6 grid-rows-2 md:grid-rows-1 gap-x-5 md:gap-x-0 gap-y-3 mt-7 px-5 md:px-20">
              <EmailShareButton url={url}>
                <EmailIcon size={38} round={true} />
              </EmailShareButton>
              <FacebookShareButton url={url}>
                <FacebookIcon size={38} round={true} />
              </FacebookShareButton>
              <PinterestShareButton url={url}>
                <PinterestIcon size={38} round={true} />
              </PinterestShareButton>
              <TwitterShareButton url={url}>
                <TwitterIcon size={38} round={true} />
              </TwitterShareButton>
              <RedditShareButton url={url}>
                <RedditIcon size={38} round={true} />
              </RedditShareButton>
              <WhatsappShareButton url={url}>
                <WhatsappIcon size={38} round={true} />
              </WhatsappShareButton>
            </div>
          </div>
        </div>
        <Toaster position="bottom-center" />
      </div>
    </>
  );
};

export default SocialMediaShareModal;
