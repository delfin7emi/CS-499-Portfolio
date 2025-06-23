// src/components/NavigationBar.js

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function NavigationBar() {
  const navigate = useNavigate();

  // Determine login state using JWT in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // Clear JWT token and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-lg flex justify-between items-center">
      {/* Brand Title */}
      <NavLink to="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition">
        Grazioso Rescue
      </NavLink>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6 text-base">
        {isAuthenticated ? (
          <>
            {/* Authenticated Routes */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-semibold"
                  : "hover:text-yellow-300 transition"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/search/dogs"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-semibold"
                  : "hover:text-yellow-300 transition"
              }
            >
              Dogs
            </NavLink>

            <NavLink
              to="/search/monkeys"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-semibold"
                  : "hover:text-yellow-300 transition"
              }
            >
              Monkeys
            </NavLink>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md"
            >
              Logout
            </Button>
          </>
        ) : (
          // Guest Route: Login
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-400 font-semibold"
                : "hover:text-yellow-300 transition"
            }
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default NavigationBar;
