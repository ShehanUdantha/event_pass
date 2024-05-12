import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useStateContext } from "../context";
import * as yup from "yup";
import { uploadFileToIPFS } from "../services/pinata";
import toast, { Toaster } from "react-hot-toast";

const VideoUploadModal = ({
  isVisible,
  onClose,
  onCallBack,
  onLoading,
  event,
}) => {
  if (!isVisible) return null;

  const { address, connect, addEventMedia } = useStateContext();

  const [selectVideo, setSelectVideo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const notifyFileNotValid = () =>
    toast.error("Please select a valid video file!");
  const notifyUnAuthorized = () => toast.error("Unauthorized entity");
  const notifyConnectWallet = () => toast.error("Please connect your wallet");
  const notifySomethingWrong = () => toast.error("Something went wrong!");

  const schema = yup.object().shape({
    title: yup.string().required("Please enter the event title"),
    videoUrl: yup.string().required("Please select the video"),
  });

  const [formDetails, setFormDetails] = useState({
    title: "",
    videoUrl: "",
  });

  const handleChange = (e) => {
    if (e.target.name == "videoUrl") {
      const file = e.target.files[0];
      if (file) {
        if (file.type.startsWith("video/")) {
          setFormDetails({
            ...formDetails,
            [e.target.name]: file.name,
          });
          setSelectVideo(file);
        } else {
          setSelectVideo("");
          notifyFileNotValid();
        }
      } else {
        setSelectVideo("");
      }
    } else {
      setFormDetails({
        ...formDetails,
        [e.target.name]: e.target.value,
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // If submitting, do nothing
    if (isSubmitting) return;

    // Start submitting
    setIsSubmitting(true);

    try {
      // Validation
      await schema.validate(formDetails, { abortEarly: false });

      // Create new event
      if (address !== null) {
        if (event && address !== null && address === event.owner) {
          onLoading(true);

          try {
            let uploadUrl;

            if (selectVideo !== "") {
              const response = await uploadFileToIPFS(
                selectVideo,
                `event_${event.id}`,
                `${selectVideo.name}`
              );
              if (response.success === true) {
                uploadUrl = response.pinataURL;
              } else {
                console.error("Error uploading video:", response.message);
                throw new Error(response.message);
              }
            }
            if (uploadUrl !== "") {
              const response = await addEventMedia({
                eventId: event.id,
                title: formDetails.title,
                videoUrl: uploadUrl,
              });

              onLoading(false);
              if (response) {
                onCallBack();
                onClose();
              }
            }
          } catch (error) {
            console.error("Error handling event media submission:", error);
            onLoading(false);
            notifySomethingWrong();
          }
        } else {
          notifyUnAuthorized();
        }
      } else {
        connect();
        notifyConnectWallet();
      }
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    } finally {
      // Reset submitting state after 3 seconds
      setTimeout(() => {
        setIsSubmitting(false);
      }, 3000);
    }
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

          <form onSubmit={onSubmit}>
            <div className="w-full">
              <p className="text-[14px] font-medium mb-1">Video Title</p>
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
            <div className="w-full mt-2">
              <p className="text-[14px] font-medium mb-1">Video</p>
              <div className="flex items-center justify-center border border-dashed border-indigo-600 rounded p-4 cursor-pointer h-20 relative">
                <label
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-600 text-[14px] cursor-pointer px-2"
                  htmlFor="video"
                >
                  {formDetails.videoUrl != ""
                    ? formDetails.videoUrl
                    : "Select the video"}
                </label>
                <input
                  id="video"
                  type="file"
                  name="videoUrl"
                  accept="video/*"
                  hidden
                  onChange={handleChange}
                />
              </div>
              <p className="text-[12px] text-red-500">{errors.videoUrl}</p>
            </div>
            <div className="flex mt-5 text-white justify-end">
              <input
                className="bg-[#4338ca] cursor-pointer px-10 py-1 font-medium rounded hover:bg-[#6366f1] transition-all duration-200 ease-in"
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </>
  );
};

export default VideoUploadModal;
