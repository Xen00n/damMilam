import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logoo from "../assets/logoo.png";


const Navbar = (props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  // Toggle menu visibility
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <nav className="bg-light border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-8">
          <a
            href="http://localhost:5173/home"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={Logoo} className="h-14" alt="Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              damMilam
            </span>
          </a>
          <button
            onClick={handleMenuToggle}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-300 dark:text-gray-400 dark:hover:bg-gray-900 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

                    <div className={`w-full md:block md:w-auto ${isMenuOpen ? '' : 'hidden'}`} id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-light rounded-lg bg-light md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-light dark:bg-gray-900 md:dark:bg-gray-900 dark:border-dark">
                        <li>
                                <NavLink 
                                    to="/home" 
                                    className={({ isActive }) => isActive ? "text-green-700 dark:text-green-600 block py-2 px-3 bg-gray-200 md:bg-transparent" : "text-gray-900 dark:text-white hover:text-green-700 dark:hover:dark:text-green-600 block py-2 px-3"}>
                                    Home
                                </NavLink>
                            </li>
                            {props.isLogedIn?(<>
                                <li>
                                <NavLink 
                                    to="/profile" 
                                    className={({ isActive }) => isActive ? "text-green-700 dark:text-green-600 block py-2 px-3 bg-gray-200 md:bg-transparent" : "text-gray-900 dark:text-white hover:text-green-700 dark:hover:dark:text-green-600 block py-2 px-3"}>
                                    Profile
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/messages" 
                                    className={({ isActive }) => isActive ? "text-green-700 dark:text-green-600 block py-2 px-3 bg-gray-200 md:bg-transparent" : "text-gray-900 dark:text-white hover:text-green-700 dark:hover:dark:text-green-600 block py-2 px-3"}>
                                    Messages
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/logout" 
                                    className={({ isActive }) => isActive ? "text-green-700 dark:text-green-600 block py-2 px-3 bg-gray-200 md:bg-transparent" : "text-gray-900 dark:text-white hover:text-green-700 dark:hover:dark:text-green-600 block py-2 px-3"}>
                                    Logout
                                </NavLink>
                            </li>
                            </>):(<>
                                <li>
                                <NavLink 
                                    to="/login" 
                                    className={({ isActive }) => isActive ? "text-green-700 dark:text-green-600 block py-2 px-3 bg-gray-200 md:bg-transparent" : "text-gray-900 dark:text-white hover:text-green-700 dark:hover:dark:text-green-600 block py-2 px-3"}>
                                    Login
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/signup" 
                                    className={({ isActive }) => isActive ? "text-green-700 dark:text-green-600 block py-2 px-3 bg-gray-200 md:bg-transparent" : "text-gray-900 dark:text-white hover:text-green-700 dark:hover:dark:text-green-600 block py-2 px-3"}>
                                    Signup
                                </NavLink>
                            </li>
                            </>)}
                            
                            
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
  );
};

export default Navbar;
