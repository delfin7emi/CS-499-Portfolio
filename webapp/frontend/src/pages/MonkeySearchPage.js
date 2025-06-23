// src/pages/MonkeySearchPage.js

import React, { useState } from "react";
import axios from "axios";

// UI components from shadcn/ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Custom list component
import MonkeyList from "@/components/MonkeyList";

function MonkeySearchPage() {
  const [searchParams, setSearchParams] = useState({
    id: "",
    name: "",
    species: "",
    reserved: ""
  });

  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`/monkeys/search?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setResults(response.data.results || []);
    } catch (err) {
      setError(err.response?.data?.error || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchParams({ id: "", name: "", species: "", reserved: "" });
    setResults([]);
    setError("");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fadeIn transition-all duration-500">
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">
        Search Monkeys
      </h1>

      {/* Search Form Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div>
          <Label htmlFor="id" className="dark:text-gray-200">Monkey ID</Label>
          <Input
            id="id"
            name="id"
            placeholder="e.g. M001"
            value={searchParams.id}
            onChange={handleChange}
            className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
        </div>

        <div>
          <Label htmlFor="name" className="dark:text-gray-200">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Bubbles"
            value={searchParams.name}
            onChange={handleChange}
            className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
        </div>

        <div>
          <Label htmlFor="species" className="dark:text-gray-200">Species</Label>
          <Input
            id="species"
            name="species"
            placeholder="e.g. Capuchin"
            value={searchParams.species}
            onChange={handleChange}
            className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
        </div>

        <div>
          <Label htmlFor="reserved" className="dark:text-gray-200">Reserved</Label>
          <select
            id="reserved"
            name="reserved"
            value={searchParams.reserved}
            onChange={handleChange}
            className="w-full border rounded-md p-2 dark:bg-gray-900 dark:text-white dark:border-gray-700"
          >
            <option value="">Any</option>
            <option value="true">Reserved</option>
            <option value="false">Available</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-6 print:hidden">
        <Button
          onClick={handleSearch}
          disabled={loading}
          className="transition-transform duration-200 hover:scale-105"
        >
          {loading ? "Searching..." : "Search"}
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-600 dark:text-red-400 font-semibold mb-4">
          {error}
        </div>
      )}

      {/* Results */}
      <MonkeyList monkeys={results} />

      {/* Empty State */}
      {!error && results.length === 0 && !loading && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No monkeys found matching your criteria.
        </p>
      )}
    </div>
  );
}

export default MonkeySearchPage;
