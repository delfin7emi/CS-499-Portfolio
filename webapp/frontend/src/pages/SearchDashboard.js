// src/components/SearchDashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function SearchDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-fadeIn">
      {/* Page title */}
      <h1 className="text-4xl font-bold text-center mb-2 dark:text-white">
        Search Animal Records
      </h1>

      {/* Description */}
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        Choose whether you'd like to search for dogs or monkeys in the system.
      </p>

      {/* Navigation Cards */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Dog Search Option */}
        <Card className="transition-all transform hover:scale-105 hover:shadow-2xl bg-white dark:bg-gray-800 dark:text-white">
          <CardContent className="p-6 flex flex-col items-center space-y-4 text-center">
            <h2 className="text-xl font-semibold">Search Dogs</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Filter and find dogs by ID, name, training status, reservation, and more.
            </p>
            <Button onClick={() => navigate("/search/dogs")}>Go to Dog Search</Button>
          </CardContent>
        </Card>

        {/* Monkey Search Option */}
        <Card className="transition-all transform hover:scale-105 hover:shadow-2xl bg-white dark:bg-gray-800 dark:text-white">
          <CardContent className="p-6 flex flex-col items-center space-y-4 text-center">
            <h2 className="text-xl font-semibold">Search Monkeys</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Locate monkeys by ID, species, name, and reservation status.
            </p>
            <Button onClick={() => navigate("/search/monkeys")}>Go to Monkey Search</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SearchDashboard;
