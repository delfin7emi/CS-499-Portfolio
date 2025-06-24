# CS-499 Portfolio – Grazioso Rescue Animal System (Full Stack Capstone)

**Author:** Emireth Castro  
**Course:** CS 499 Computer Science Capstone  
**Instructor:** Dr. Fitzsimmons  
**Term:** 2025  
**Portfolio URL:** [https://delfin7emi.github.io/CS-499-Portfolio/](https://delfin7emi.github.io/CS-499-Portfolio/)

---

## 📌 Overview

This portfolio showcases the original and enhanced artifacts I developed for the SNHU Computer Science Capstone. I modernized the Grazioso rescue animal system from a Java console program into a full-stack MERN-style application using HTML, CSS, JavaScript, Node.js, Express, and MongoDB. Enhancements were guided by three key outcomes:

- 🛠️ **Software Engineering & Design**
- 🧠 **Algorithms & Data Structures**
- 💾 **Databases**

Each enhancement demonstrates the application of industry best practices in architecture, optimization, and data integrity.

---

## ✅ Features Summary

- 🐶 Dog intake, search, edit, delete, and reserve
- 🐒 Monkey intake, search, edit, delete, and reserve
- 🔍 Filtering by ID (binary search), name, species, status
- ☁️ RESTful API with full CRUD operations (Node.js/Express)
- 🧠 Binary search optimization for fast lookups
- 🔐 Authentication with JWT, bcrypt, password strength checks
- 🧪 Unit and integration testing with Jest and Supertest
- 💾 MongoDB integration using Mongoose schemas
- 📤 JSON import/export with frontend and backend sync
- 🎨 Responsive UI with clean CSS and mobile-ready layout

---

## 🛠️ Enhancement 1 – Software Engineering & Design

### 🧾 Original Artifacts
- [`Dog.java`](Dog.java)
- [`Driver.java`](Driver.java)

### 🚀 Enhanced Artifacts
- [`server.js`](webapp/backend/server.js) – Express app entry point
- [`Dogs.js`](webapp/backend/models/Dogs.js) – Mongoose model for dog data
- Modular routing, middleware, and services

### 🧩 Description

I refactored the monolithic Java CLI program into a RESTful web service using Node.js and Express. The new design separates routing, logic, validation, and data handling. I applied design patterns such as controller/service abstraction and introduced schema validation and error handling middleware.

This improves:
- Maintainability (separation of concerns)
- Scalability (modular expansion)
- Professional backend structure aligned with industry standards

---

## 🧠 Enhancement 2 – Algorithms & Data Structures

### 🧾 Original Artifacts
- [`RescueAnimal.java`](RescueAnimal.java)
- [`Monkey.java`](Monkey.java)

### 🚀 Enhanced Artifacts
- [`binarySearch.js`](webapp/backend/utils/binarySearch.js)
- [`binarySearch.test.js`](webapp/backend/tests/binarySearch.test.js)

### ⚙️ Algorithmic Improvements

- Implemented custom **binary search** for ID lookups in `/dogs/search` and `/monkeys/search`
- Reduced time complexity from O(n) → **O(log n)**
- Used sorted array + `localeCompare()` for safe alphanumeric comparisons
- Built Jest unit tests with edge-case coverage

### 🧪 Test Coverage

Test suites include:
- `authController.test.js`
- `dogSearch.test.js`, `monkeySearch.test.js`
- `dogPost.test.js`, `monkeyPost.test.js`
- `binarySearch.test.js`

These demonstrate my ability to apply efficient data structures and rigorous testing in real-world full-stack applications.

---

## 💾 Enhancement 3 – Databases

### 🧾 Original Artifacts
- [`Monkey.java`](Monkey.java)
- [`Driver.java`](Driver.java)

### 🚀 Enhanced Artifacts
- [`Monkeys.js`](webapp/backend/models/Monkeys.js)
- [`monkeys.json`](webapp/backend/data/monkeys.json)

### 🗃️ Database Architecture

- Converted static arrays into persistent MongoDB collections
- Created Mongoose schemas for Dogs and Monkeys with:
  - Field validation
  - Default values
  - Middleware enforcement
- Enabled full backend CRUD operations: `GET`, `POST`, `PUT`, `DELETE`
- Integrated frontend-to-backend data sync for monkey/dog management

This enhancement demonstrates advanced data modeling, backend integration, and persistence best practices.

---

## 🔐 Security Features

- **JWT Authentication** (with bcrypt hashing and expiration)
- **Middleware Authorization** for protected routes
- **Password Strength** enforcement with `zxcvbn`
- **Rate Limiting** on sensitive endpoints (100 reqs/15 min)
- **Environment Variables** for DB config and secrets (`dotenv-flow`)

---

## 🧪 Testing Strategy

- Jest + Supertest used for all backend endpoints
- Includes:
  - Binary search tests
  - POST/GET endpoint validation
  - Login/auth/register
- Test coverage: Verified via `npm test -- --coverage`

---

## 🧭 Directory Structure
CS-499-Portfolio/
│
├── Dog.java
├── Driver.java
├── Monkey.java
├── RescueAnimal.java
├── animals.txt
│
├── webapp/
│ ├── backend/
│ │ ├── server.js
│ │ ├── models/
│ │ │ ├── Dogs.js
│ │ │ ├── Monkeys.js
│ │ ├── data/
│ │ │ └── monkeys.json
│ │ ├── utils/
│ │ │ └── binarySearch.js
│ │ └── tests/
│ │ └── binarySearch.test.js
│
├── index.html
├── README.md

---

## 🧠 Capstone Learning Outcomes

✅ Apply computer science theory and software development fundamentals  
✅ Design and evaluate computing solutions aligned with user needs  
✅ Apply algorithms and data structures in full-stack development  
✅ Design database solutions to manage data persistence and access  
✅ Communicate technical information clearly and professionally  

---

## 🌐 Live Portfolio

🔗 GitHub Pages: [https://delfin7emi.github.io/CS-499-Portfolio/](https://delfin7emi.github.io/CS-499-Portfolio/)  
🔗 GitHub Repo: [https://github.com/delfin7emi/CS-499-Portfolio](https://github.com/delfin7emi/CS-499-Portfolio)

---

## 📄 Narratives (See GitHub Pages)

- [Software Design Narrative (PDF)](docs/software-engineering-narrative.pdf)
- [Algorithms & Data Structures Narrative (PDF)](docs/algorithms-data-structure-narrative.pdf)
- [Databases Narrative (PDF)](docs/database-narrative.pdf)

---

## 👩‍💻 Author Info

**Emireth Castro**  
Full Stack Developer in training  
Woodburn, Oregon | SNHU CS Graduate  
Passionate about backend APIs, secure design, and solving real-world tech problems  
[GitHub Profile](https://github.com/delfin7emi) 

---



