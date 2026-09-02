# Expense Tracker

A full-stack personal finance application for managing accounts, transactions, transfers, categories, balances, and financial summaries.

The project combines a production-oriented TypeScript/Node.js REST API with a modern React frontend and PostgreSQL database, deployed using Vercel, Render, and Neon.

## Live Demo

**Frontend:** `https://expense-tracker-eight-nu-50.vercel.app/`

**Backend API:** `https://expense-tracker-zkc7.onrender.com/`

**GitHub:** `https://github.com/niksonstha/expense-tracker`

> The backend root URL is an API service and does not provide a frontend interface.

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Protected API routes
* Password hashing with bcrypt
* Authenticated user restoration
* Protected frontend routes

### Accounts

* Create accounts
* View account details
* Update accounts
* Delete accounts
* Account ownership protection
* Account balance calculations
* Supported account types:

  * Bank
  * Savings
  * Cash
  * Credit Card

### Transactions

* Create income transactions
* Create expense transactions
* Update transactions
* Delete transactions
* View individual transactions
* Paginated transaction listing
* Search transactions
* Filter by account
* Filter by category
* Filter by transaction type
* Filter by date range
* Sort by transaction date
* Transaction ownership protection
* Loading and empty states

### Transfers

* Transfer money between accounts
* Creates outgoing and incoming transaction records
* Atomic transfer operations using database transactions
* Transfer ownership protection
* Transfer validation
* Transfer success and error feedback

### Categories

* System income and expense categories
* User-specific categories
* Create categories
* Edit categories
* Delete categories
* Category type validation
* Category ownership protection

### Financial Summaries

* Total balance
* Total income
* Total expenses
* Monthly income
* Monthly expenses
* Monthly net balance
* Spending by category
* Spending percentages

### Dashboard

* Financial summary cards
* Account balances
* Recent transactions
* Current-month spending breakdown
* Spending-by-category visualization
* Quick expense creation
* Loading skeletons
* Empty states
* Error handling
* Success notifications

### Frontend UI

* Modern responsive dashboard
* React + TypeScript
* Tailwind CSS
* Lucide icons
* Responsive sidebar navigation
* Mobile navigation drawer
* Light and dark themes
* Theme persistence
* Responsive transaction views
* Reusable UI components
* Loading states and skeletons
* Toast notifications
* Confirmation dialogs
* Form validation
* Submit loading states
* Responsive layouts for desktop, tablet, and mobile

### API Security & Reliability

* Helmet
* CORS
* Rate limiting
* Request body size limits
* Environment variable validation
* Graceful server shutdown
* PostgreSQL connection pooling
* Centralized error handling
* Request IDs
* Input validation with Zod
* Parameterized database queries through Drizzle ORM

### Testing

* Authentication tests
* Account ownership tests
* Transaction ownership tests
* Transfer tests
* Cross-user resource access prevention
* API and business-rule validation

## Tech Stack

### Backend

* Node.js
* TypeScript
* Express 5
* PostgreSQL
* Drizzle ORM
* Zod
* JWT
* bcrypt
* Helmet
* CORS
* Vitest
* Supertest

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* Tailwind CSS
* Lucide React

### Deployment

* Vercel — React frontend
* Render — Node.js/Express backend
* Neon — PostgreSQL database

## Architecture

```text
┌─────────────────────────┐
│       React Frontend    │
│   React + TypeScript    │
│       Vite + Tailwind   │
└────────────┬────────────┘
             │ HTTPS / REST API
             ▼
┌─────────────────────────┐
│       Node.js API       │
│   Express + TypeScript  │
│      Drizzle ORM        │
└────────────┬────────────┘
             │ PostgreSQL
             ▼
┌─────────────────────────┐
│       PostgreSQL        │
│          Neon           │
└─────────────────────────┘
```

The frontend communicates with the versioned REST API through Axios. The backend handles authentication, validation, business logic, authorization, and database operations through Drizzle ORM.

## Project Structure

```text
expense-tracker/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── errors/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   └── layout/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── accounts/
│   │   │   ├── transactions/
│   │   │   ├── categories/
│   │   │   ├── transfers/
│   │   │   └── dashboard/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* PostgreSQL

### Clone the Repository

```bash
git clone https://github.com/niksonstha/expense-tracker.git
cd expense-tracker
```

## Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

Make sure PostgreSQL is running and the database exists.

Run database migrations:

```bash
npm run db:migrate
```

Seed the system categories:

```bash
npm run db:seed
```

## Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

The frontend communicates with the backend through the configured `VITE_API_URL`.

## Running the Application

### Start the Backend

From `backend/`:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

Health check:

```text
GET /health
```

### Start the Frontend

From `frontend/`:

```bash
npm run dev
```

Vite will provide the local development URL, normally:

```text
http://localhost:5173
```

## Backend Commands

Development:

```bash
npm run dev
```

Type checking:

```bash
npm run typecheck
```

Build:

```bash
npm run build
```

Production:

```bash
npm start
```

Database commands:

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
npm run db:seed
```

Testing:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

## API

The API is versioned under:

```text
/api/v1
```

### Authentication

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/me
```

### Accounts

```text
POST   /api/v1/account
GET    /api/v1/account
GET    /api/v1/account/:id
PATCH  /api/v1/account/:id
DELETE /api/v1/account/:id
```

### Transactions

```text
POST   /api/v1/transactions
GET    /api/v1/transactions
GET    /api/v1/transactions/:id
PATCH  /api/v1/transactions/:id
DELETE /api/v1/transactions/:id
```

### Transfers

```text
POST /api/v1/transfers
GET  /api/v1/transfers/:id
```

### Categories

```text
POST   /api/v1/categories
GET    /api/v1/categories
GET    /api/v1/categories/:id
PATCH  /api/v1/categories/:id
DELETE /api/v1/categories/:id
```

### Dashboard

The dashboard APIs provide financial summaries, account information, recent transactions, monthly statistics, and spending analysis.

Authenticated endpoints require:

```http
Authorization: Bearer <access-token>
```

## Database

The application uses PostgreSQL with Drizzle ORM.

The main database relationships are:

```text
Users
 │
 ├── Accounts
 │
 ├── Categories
 │
 ├── Transfers
 │
 └── Transactions
        │
        ├── Account
        ├── Category
        └── Transfer
```

Transfers are represented by a transfer record and two transaction records:

```text
Transfer
   │
   ├── OUT transaction → source account
   │
   └── IN transaction → destination account
```

The transfer operation is performed inside a PostgreSQL database transaction to prevent partial transfers and maintain consistent account balances.

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The test suite covers important security and business rules including:

* Authentication
* Account ownership
* Transaction ownership
* Transfer creation
* Cross-user resource access prevention
* Validation
* Error handling
* Business-rule enforcement

## Environment Variables

### Backend

The backend validates required environment variables when the application starts.

```env
NODE_ENV
PORT
DATABASE_URL
JWT_SECRET
FRONTEND_URL
```

### Frontend

```env
VITE_API_URL
```

Do not commit `.env` files.

Make sure environment files are included in `.gitignore`.

## Security

The application includes several security measures:

* Passwords are never stored as plain text
* Passwords are hashed using bcrypt
* JWT authentication protects private routes
* Resources are scoped to the authenticated user
* Zod validates incoming data
* Rate limiting protects API endpoints
* Helmet adds HTTP security headers
* CORS restricts frontend access
* Request body size is limited
* Database operations use parameterized queries through Drizzle ORM
* Multi-step transfer operations use PostgreSQL transactions
* Ownership checks prevent users from accessing another user's resources

## Completed Development

### Backend

* [x] Authentication
* [x] Accounts
* [x] Transactions
* [x] Categories
* [x] Account balances
* [x] Account-to-account transfers
* [x] Database transactions
* [x] Financial summaries
* [x] Dashboard APIs
* [x] Monthly financial summaries
* [x] Spending analysis
* [x] Automated tests
* [x] Production hardening
* [x] Production deployment

### Frontend

* [x] React application
* [x] Authentication UI
* [x] Login/Register
* [x] Protected routes
* [x] Dashboard
* [x] Account management
* [x] Transaction management
* [x] Transfer management
* [x] Categories
* [x] Financial summaries
* [x] Spending visualization
* [x] Loading and error states
* [x] Toast notifications
* [x] Confirmation dialogs
* [x] Responsive design
* [x] Dark mode
* [x] Mobile navigation
* [x] UI polish and responsive improvements
* [x] Production deployment

## Planned Improvements

* [ ] Budget management
* [ ] Advanced analytics
* [ ] Recurring transactions
* [ ] CSV import/export
* [ ] PDF financial reports
* [ ] Refresh-token authentication
* [ ] Email verification
* [ ] Password reset
* [ ] Notifications
* [ ] CI/CD pipeline
* [ ] Automated database backups
* [ ] Production monitoring

## License

This project is currently developed for learning, portfolio development, and personal development purposes.
