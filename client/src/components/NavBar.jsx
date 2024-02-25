import React, { useState } from "react";
import { navLinks } from "../constants/index";
import logo from "../assets/icons/logo-icon.png";
import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white fixed top-0 left-0 right-0">
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
          {navLinks.map((item) => (
            <li key={item.path}>
              <NavLink
                className={({ isActive, isPending }) =>
                  isActive ? "active" : ""
                }
                to={item.path}
                key={item.path}
              >
                {item.link}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* wallet connect button */}
        <div className="text-white lg:flex gap-4 items-center hidden">
          <button className="bg-[#4338ca] px-6 py-2 font-medium rounded hover:bg-[#6366f1] transition-all duration-200 ease-in">
            Connect Wallet
          </button>
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
          {navLinks.map((item) => (
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
          ))}
          <li key={"wallet"}>
            <NavLink
              className={({ isActive, isPending }) => (isActive ? "" : "")}
              onClick={toggleMenu}
              to={"/"}
              key={"wallet"}
            >
              {"Connect Wallet"}
            </NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default NavBar;
