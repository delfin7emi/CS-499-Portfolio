// src/pages/HomePage.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-4 animate-fadeIn">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">
        Welcome to Grazioso Rescue
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl text-center mb-10">
        This platform helps staff search, manage, and review rescue dogs and monkeys.
        Use the dashboard to explore animal records, add new entries, and filter by ID, name, training, or status.
      </p>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-6">
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-md transform hover:scale-105 transition duration-300"
          onClick={() => navigate("/search/dogs")}
        >
          Search Dogs
        </Button>

        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl shadow-md transform hover:scale-105 transition duration-300"
          onClick={() => navigate("/search/monkeys")}
        >
          Search Monkeys
        </Button>
      </div>
    </div>
  );
}

export default HomePage;
