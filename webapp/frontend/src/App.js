// src/App.js

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

// Components
import NavigationBar from "@/components/NavigationBar";

// Pages
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import DogSearchPage from "@/pages/DogSearchPage";
import MonkeySearchPage from "@/pages/MonkeySearchPage";
import SearchDashboard from "@/pages/SearchDashboard";
import DogManager from "@/pages/DogManager";
import MonkeyManager from "@/pages/MonkeyManager";
import NotFoundPage from "@/pages/NotFoundPage";

// Auth utility
const isAuthenticated = () => Boolean(localStorage.getItem("token"));

// Protected route wrapper
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Animated page wrapper
const AnimatedWrapper = ({ children }) => {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-gray-900 animate-fadeIn"
    >
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <NavigationBar />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <AnimatedWrapper>
              <HomePage />
            </AnimatedWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <AnimatedWrapper>
              <LoginPage />
            </AnimatedWrapper>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/search-dashboard"
          element={
            <PrivateRoute>
              <AnimatedWrapper>
                <SearchDashboard />
              </AnimatedWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/search/dogs"
          element={
            <PrivateRoute>
              <AnimatedWrapper>
                <DogSearchPage />
              </AnimatedWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/search/monkeys"
          element={
            <PrivateRoute>
              <AnimatedWrapper>
                <MonkeySearchPage />
              </AnimatedWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/dogs"
          element={
            <PrivateRoute>
              <AnimatedWrapper>
                <DogManager />
              </AnimatedWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/monkeys"
          element={
            <PrivateRoute>
              <AnimatedWrapper>
                <MonkeyManager />
              </AnimatedWrapper>
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <AnimatedWrapper>
              <NotFoundPage />
            </AnimatedWrapper>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
