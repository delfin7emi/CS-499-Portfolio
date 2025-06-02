# CS-499-Portfolio# 

CS-499 Portfolio – Algorithms and Data Structure Enhancement

## 🧠 Enhancement Two: Algorithms and Data Structure

This enhancement demonstrates the application of algorithmic principles and data structure efficiency through a secure, token-based animal rescue system. It expands the original Java-based project by introducing a fully functional **Node.js backend API**, **user authentication**, **search algorithms**, and **security best practices**.

---

## 🔧 Key Enhancements

### ✅ Efficient Data Filtering with Search API
- Implemented `/dogs/search` and `/monkeys/search` endpoints
- Added support for filtering by species, name, and reservation status
- Optimized loop-based search logic with linear filtering (O(n))

### ✅ User Authentication with JWT
- Added `/auth/register` and `/auth/login` endpoints
- Passwords hashed with **bcrypt**
- Token generation with **jsonwebtoken**
- Token expiration set to 1 hour for security

### ✅ Middleware Authorization
- Protected animal search endpoints with `Authorization: Bearer <token>`
- Tokens validated via a middleware function for route protection

### ✅ Password Strength Validation
- Integrated **zxcvbn** to evaluate password complexity during registration
- Prevents weak passwords from being accepted

### ✅ Rate Limiting
- Added protection against brute-force attacks using **express-rate-limit**
- Limits requests to 100 per 15-minute window

### ✅ Environment-Based Configuration
- Used `.env.development`, `.env.production`, and `dotenv-flow`
- Keeps secrets and tokens secure per environment

---

## 🧪 Testing

All unit tests for authentication, dog/monkey search, and error cases are implemented using **Jest** and **Supertest**.

### ✅ Test Suites:
- `authController.test.js`
- `dogSearch.test.js`
- `monkeySearch.test.js`

```bash
npm install
npm test
