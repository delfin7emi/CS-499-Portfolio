

# CS-499-Portfolio
# Grazioso Rescue Animal System – Full Stack Enhancement

**Author:** Emireth Castro  
**Course:** CS 499 Computer Science Capstone  
**Instructor:** Dr. Fitzsimmons  
**Branch:** software-design-enhancement

---

## 📌 Overview

This enhanced project modernizes the original Java-based Grazioso animal rescue management system by implementing a full-stack web application using HTML, CSS, JavaScript, and a Node.js/Express backend with JSON file storage.

Users can intake, search, reserve, export, and manage dog and monkey records through a responsive web interface. The app is supported by a local RESTful API, making it a dynamic and scalable solution for rescue animal operations.

---

## ✅ Key Features

- 🐶 Submit and manage **Dog** records
- 🐒 Submit and manage **Monkey** records
- 🔍 Search by name, species, or type
- 📄 Print and display stored animals
- ☁️ Save to backend via **POST** `/dogs` and `/monkeys`
- 🔁 Fetch from backend via **GET** `/dogs` and `/monkeys`
- 💾 Use `localStorage` for frontend persistence
- 📤 Export as `.json`
- 📥 Import from `.json` and sync to backend
- 🎨 Styled and responsive with custom CSS
- 🧹 "Clear Data" button to reset frontend cache

---

## 📁 Project Structure

=======
# CS-499-Portfolio# 
=======
#  CS-499 Portfolio – Algorithms and Data Structures Enhancement


This enhancement showcases the application of algorithmic logic and data structure optimization in a full-stack rescue animal management system. It expands the original Java-based Grazioso Salvare project by integrating:

- A Node.js + Express RESTful backend
- Binary search for efficient data retrieval
- Secure authentication with JWT
- Automated testing with Jest and Supertest

This work supports Capstone Outcome 2: **"Employ algorithms and data structures in program design."**

---

##  Key Enhancements

###  Efficient Search API with Binary Search
- Implemented `/dogs/search` and `/monkeys/search` endpoints
- Searches by `id` use a custom **binary search** utility (`binarySearch.js`)
- Sorted arrays with `localeCompare()` for accurate alphanumeric ID comparison
- Filters also available by `name`, `species`, `trainingStatus`, and `reserved` status

###  Custom Binary Search Algorithm
- Binary search implemented from scratch
- Time complexity: **O(log n)** for ID lookups
- Unit tested separately in `binarySearch.test.js`
- Used in production endpoints for optimal performance

###  Robust Fallback Filtering
- If no `id` is provided, fallbacks apply:
  - Name → partial match
  - Species or trainingStatus → exact match (case-insensitive)
  - Reserved status → boolean filter

---

##  Security

###  JWT Authentication
- Secure user registration/login using `jsonwebtoken`
- Passwords hashed with `bcrypt`
- Token expires in 1 hour
- Token required for all protected routes

###  Middleware Authorization
- JWT middleware validates requests on:
  - `/dogs`, `/monkeys`
  - `/dogs/search`, `/monkeys/search`
  - `/dogs` and `/monkeys` POST routes

###  Password Strength Enforcement
- Uses `zxcvbn` to evaluate complexity
- Prevents weak passwords during registration

###  Rate Limiting
- Limits requests to 100 per 15 minutes
- Helps prevent brute-force attacks

###  Environment Variables
- Uses `.env`, `.env.development`, `.env.production` to store secrets
- Secured with `dotenv-flow`

---

##  Automated Testing

All enhancements are backed by complete unit/integration tests using **Jest** and **Supertest**.

###  Test Suites:
- `authController.test.js`
- `dogSearch.test.js`
- `monkeySearch.test.js`
- `dogPost.test.js`
- `monkeyPost.test.js`
- `binarySearch.test.js`

###  Coverage
```bash
npm test -- --coverage
