# KodnestBank - Modern Banking Application

KodnestBank is a secure, modern monorepo-based banking application built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## 🚀 Features

- **Secure Authentication**: JWT-based auth with access/refresh tokens and HTTP-Only cookies.
- **Banking Operations**: Deposit, Withdraw, and Atomically Transfer funds between accounts.
- **Transactions**: Full history with categorization and real-time balance updates.
- **Security**: 
  - Helmet for secure HTTP headers.
  - Rate limiting to prevent brute force.
  - Zod for strict input validation.
  - MongoDB Transactions for data integrity during transfers.
- **Premium UI**: Modern Dashboard with Tailwind CSS, responsive design, and smooth animations.

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Axios, React Router.
- **Backend**: Node.js, Express, TypeScript, Mongoose, JWT, Bcrypt.
- **Database**: MongoDB.

---

## 🏗️ Project Structure

```text
kodnestbank/
├── backend/            # Express API with TypeScript
│   ├── src/
│   │   ├── config/     # DB & Config
│   │   ├── controllers/# Request Handlers
│   │   ├── middleware/ # Auth, Error, Validation
│   │   ├── models/     # Mongoose Schemas
│   │   ├── routes/     # API Endpoints
│   │   ├── services/   # Business Logic
│   │   └── utils/      # JWT, Account Generators
├── frontend/           # React App with TypeScript & Vite
│   ├── src/
│   │   ├── api/        # Axios Interceptors
│   │   ├── components/ # UI Components
│   │   ├── context/    # Global Auth State
│   │   ├── pages/      # View Components
│   │   └── routes/     # Protected Routing
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or on Atlas)

### 1. Clone & Install
```bash
git clone <repository-url>
cd kodnestbank
npm install
```

### 2. Backend Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kodnestbank
ACCESS_TOKEN_SECRET=your_secret_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_secret_here
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 3. Frontend Configuration
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Running the App
From the **root** directory:
```bash
# Start both Backend and Frontend in development mode
npm run dev --workspace=backend
# (In another terminal)
npm run dev --workspace=frontend
```

---

## 🔒 Security Measures
- **Rate Limiting**: 100 requests per 15 minutes per IP.
- **Data Integrity**: Uses Mongoose sessions for multi-account transfers.
- **JWT Protection**: Tokens are validated on every protected route.
- **XSS/Clickjacking**: Prevented via Helmet middleware.

---

## 📄 License
ISC
