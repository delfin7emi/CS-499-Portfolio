// src/pages/LoginPage.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// UI components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit login form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/auth/login", form);
      localStorage.setItem("token", response.data.token);
      navigate("/search-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 animate-fadeIn">
      <Card className="w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl transition-all duration-500">
        <CardContent className="p-6 space-y-6">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">
            Admin Login
          </h2>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center dark:text-red-400">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="admin@example.com"
                className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
              />
            </div>

            {/* Password Input */}
            <div>
              <Label htmlFor="password" className="dark:text-gray-200">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full transition-transform hover:scale-105"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
