import React, { useState, useEffect } from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { useStateContext } from "../../context";
import { ethers } from "ethers";

const HeaderSection = () => {
  const { address, signer } = useStateContext();
  const [userBalance, setUserBalance] = useState("");

  useEffect(() => {
    if (address) {
      getBalance();
    } else {
      setUserBalance("");
    }
  }, [address]);

  const getBalance = async () => {
    const balance = await signer?.getBalance();
    setUserBalance(
      balance ? ethers.utils.formatEther(balance?.toString()) : "0.0"
    );
  };

  return (
    <section className="bg-[#F6F8FD] pt-32 pb-5 min-h-[15.2rem]">
      {address == null ? (
        <div className="flex mx-auto items-center justify-center md:justify-start max-w-7xl px-4">
          <h3 className="font-bold text-3xl">Profile Details</h3>
        </div>
      ) : (
        <div className="flex mx-auto items-center justify-center max-w-7xl px-4">
          <div className="flex items-center flex-col">
            <MetaMaskAvatar address={address} size={35} />
            <h3 className="font-bold text-md text-green-500 mt-1">
              {userBalance.slice(0, 6) + (userBalance != "" ? " ETH" : "")}
            </h3>
            <div className="w-[10rem] md:w-full text-[14px] text-gray-500 font-medium mt-1 text-ellipsis overflow-hidden">
              {address}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeaderSection;
