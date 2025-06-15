import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import BG from "../assets/BG.jpg";
import Logo from "../assets/Logo.jpg";

export default function Layout({ children, user }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    // Clear localStorage
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/");
  };

  // NEW: state for drop-down visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: `url('${BG}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Navbar */}
      <header className="flex items-center justify-between px-16 py-4">
        {/* Left side - Logo + Nav links*/}
        <div className="flex items-center">
          {/* Logo */}
          <img
            src={Logo}
            alt="Eventify Logo"
            className="w-14 h-auto rounded-full shadow-md mr-12"
          />

          {/* Nav links*/}
          <nav className="flex space-x-12">
            <Link to="/home" className="text-gray-50 font-semibold hover:text-orange-500 transition-colors">Home</Link>
            <Link to="/events" className="text-gray-50 font-semibold hover:text-orange-500 transition-colors">Event</Link>
            <Link to="/contact" className="text-gray-50 font-semibold hover:text-orange-500 transition-colors">Contact</Link>
          </nav>
        </div>

        {/* Right side - User profile with drop-down*/}
        <div className="flex items-center space-x-2 relative">
          {/* User profile icon */}
          <div
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center font-semibold cursor-pointer"
          >
            {/* initials or fallback icon*/}
            {user && user.username
              ? user.username.charAt(0).toUpperCase()
              : "👤"}
          </div>

          {/* Username */}
          <span
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="text-gray-50 font-semibold ml-2 cursor-pointer"
          >
            {user && user.username ? user.username : "Guest"}
          </span>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-12 right-0 bg-gray-900 bg-opacity-90 p-4 rounded-md shadow-md">
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    to="/profile"
                    className="text-gray-50 font-semibold hover:text-orange-500 transition-colors"
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogoutClick}
                    className="text-gray-50 font-semibold hover:text-orange-500 transition-colors"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-16">{children}</main>
    </div>
  );
}
