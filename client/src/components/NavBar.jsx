import React, { useState } from "react";
import { navLinks } from "../constants/index";
import logo from "../assets/icons/logo-icon.png";
import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useStateContext } from "../context";
import ToolTip from "./ToolTip";

const NavBar = () => {
  const { address } = useStateContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white fixed top-0 left-0 right-0 z-20">
      <nav className="px-4 py-4 max-w-7xl mx-auto flex justify-between items-center">
        {/* logo */}
        <div className="flex items-center">
          <img src={logo} alt="logo" width={35} height={30} />
          <a href="/" className="font-bold text-xl pl-1">
            EventPass
          </a>
        </div>
        {/* nav items */}
        <ul className="md:flex gap-12 hidden text-md font-medium text-[#1e1b4b]">
          {navLinks.map((item) =>
            item.path === "/create-event" ? (
              address ? (
                <li key={item.path}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : ""
                    }
                    onClick={toggleMenu}
                    to={item.path}
                    key={item.path}
                  >
                    {item.link}
                  </NavLink>
                </li>
              ) : null
            ) : item.path === "/profile" ? (
              address ? (
                <li key={item.path}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : ""
                    }
                    onClick={toggleMenu}
                    to={item.path}
                    key={item.path}
                  >
                    {item.link}
                  </NavLink>
                </li>
              ) : null
            ) : (
              <li key={item.path}>
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "active" : ""
                  }
                  onClick={toggleMenu}
                  to={item.path}
                  key={item.path}
                >
                  {item.link}
                </NavLink>
              </li>
            )
          )}
        </ul>

        {/* wallet connect button */}
        <div className="text-white lg:flex gap-4 items-center hidden">
          <ToolTip message={address ? "" : "Connect to sepolia network"}>
            <ConnectWallet
              theme={"light"}
              modalSize={"compact"}
              detailsBtn={() => {
                return (
                  <div className="w-[10rem] h-[2.7rem] border rounded-3xl flex justify-center items-center cursor-pointer bg-[#4338ca] text-white">
                    <span className="text-[1.01rem] font-semibold">
                      Disconnect
                    </span>
                  </div>
                );
              }}
              className="wallet-btn"
            />
          </ToolTip>
        </div>

        {/* mobile menu icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="cursor-pointer">
            {isMenuOpen ? (
              <IoClose className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* mobile menu items */}
      <div>
        <ul
          className={`md:hidden block gap-12 text-md space-y-4 px-5 py-5 font-medium text-[#1e1b4b] bg-white ${
            isMenuOpen
              ? "fixed w-full transition-all ease-out duration-75"
              : "hidden"
          } `}
        >
          {navLinks.map((item) =>
            item.path === "/create-event" ? (
              address ? (
                <li key={item.path}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : ""
                    }
                    onClick={toggleMenu}
                    to={item.path}
                    key={item.path}
                  >
                    {item.link}
                  </NavLink>
                </li>
              ) : null
            ) : item.path === "/profile" ? (
              address ? (
                <li key={item.path}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : ""
                    }
                    onClick={toggleMenu}
                    to={item.path}
                    key={item.path}
                  >
                    {item.link}
                  </NavLink>
                </li>
              ) : null
            ) : (
              <li key={item.path}>
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "active" : ""
                  }
                  onClick={toggleMenu}
                  to={item.path}
                  key={item.path}
                >
                  {item.link}
                </NavLink>
              </li>
            )
          )}
          {/* mobile view wallet */}
          <li key={"wallet"} className="flex justify-center">
            <ToolTip message={address ? "" : "Connect to sepolia network"}>
              <ConnectWallet
                theme={"light"}
                modalSize={"compact"}
                detailsBtn={() => {
                  return (
                    <button className="bg-[#4338ca] text-white px-6 py-2 font-medium rounded hover:bg-[#6366f1] transition-all duration-200 ease-in">
                      Disconnect
                    </button>
                  );
                }}
                className="wallet-btn"
              />
            </ToolTip>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default NavBar;
