// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.css";

// Import pages (we will create these next)
import DogManager from "./components/DogManager";
import MonkeyManager from "./components/MonkeyManager";
import SearchPage from "./components/SearchPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/dogs" element={<DogManager />} />
      <Route path="/monkeys" element={<MonkeyManager />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  </Router>
);
