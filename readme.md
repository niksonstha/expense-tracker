# Expense & Personal Finance Tracker

A backend API for managing personal finances, built with **Node.js, TypeScript, Express, PostgreSQL, and Drizzle ORM**.

This project is being developed as an intermediate-level backend project to strengthen practical backend development skills, including authentication, authorization, database design, validation, REST APIs, ownership checks, filtering, pagination, and business logic.

## 🚧 Project Status

The project is currently under active development.

### Completed

- Project setup
- Environment configuration
- Express server
- PostgreSQL connection
- Drizzle ORM setup
- Database schema
- JWT authentication
- Authentication middleware
- User identification through JWT
- User account CRUD
- Category management
- Transaction creation
- Transaction listing
- Transaction filtering
- Transaction pagination
- Transaction sorting
- Transaction date filtering
- Transaction retrieval by ID
- Transaction updates
- Transaction deletion
- User ownership / authorization checks
- Zod request validation
- Centralized application errors

### Coming Next

- Account-to-account transfers
- Database transactions with `db.transaction()`
- Better transaction handling
- Financial summaries
- Account balance calculations
- Dashboard APIs
- Monthly reports
- Spending analysis
- React frontend
- Testing
- Production improvements

---

# Tech Stack

## Backend

- Node.js
- TypeScript
- Express 5
- PostgreSQL
- Drizzle ORM
- Zod
- JWT
- dotenv

## Development Tools

- tsx
- TypeScript
- Prettier
- ESLint

---

# Project Goals

The main purpose of this project is learning rather than simply building a CRUD application.

The project focuses on understanding how a real backend is structured.

Some of the concepts being practiced are:

- REST API design
- Authentication
- Authorization
- JWT
- Middleware
- Request validation
- Service/repository architecture
- PostgreSQL relationships
- Foreign keys
- Database constraints
- Drizzle ORM
- Query building
- Filtering
- Pagination
- Sorting
- Error handling
- Data ownership
- Business rules
- Database transactions

---

# Project Structure

The backend currently follows a layered structure:

```text
backend/
│
├── src/
│   │
│   ├── config/
│   │   └── env.ts
│   │
│   ├── controllers/
│   │   ├── account.controller.ts
│   │   ├── transaction.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── db/
│   │   ├── index.ts
│   │   └── schema.ts
│   │
│   ├── errors/
│   │   └── app-error.ts
│   │
│   ├── middleware/
│   │   └── auth.ts
│   │
│   ├── repositories/
│   │   ├── account.repository.ts
│   │   ├── category.repository.ts
│   │   └── transaction.repository.ts
│   │
│   ├── routes/
│   │   ├── account.routes.ts
│   │   ├── category.routes.ts
│   │   ├── transaction.routes.ts
│   │   └── user.routes.ts
│   │
│   ├── services/
│   │   ├── account.service.ts
│   │   ├── category.service.ts
│   │   └── transaction.service.ts
│   │
│   ├── validators/
│   │   ├── account.validator.ts
│   │   ├── transaction-query.validator.ts
│   │   └── transaction.validator.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .gitignore
├── drizzle.config.ts
├── eslint.config.mjs
├── package.json
├── prettier.config.*
├── tsconfig.json
└── README.md
```

The exact files may evolve as the project grows.

---

# Database Design

The current database contains the following main entities:

```text
users
  │
  ├── accounts
  │
  ├── categories
  │
  └── transactions
          │
          ├── accounts
          ├── categories
          └── transfers
```

## Users

Stores application users.

Important fields:

```text
id
name
email
passwordHash
createdAt
updatedAt
```

Passwords are stored as hashes rather than plain text.

---

## Accounts

Represents financial accounts owned by a user.

Examples:

```text
Main Bank
Savings Account
Cash
Credit Card
```

Account types currently supported:

```text
BANK
SAVINGS
CASH
CREDIT_CARD
```

Each account belongs to a user.

```text
users.id
    ↓
accounts.user_id
```

---

## Categories

Categories are used to classify transactions.

Supported category types:

```text
INCOME
EXPENSE
```

Examples:

```text
INCOME
├── Salary
├── Freelance
└── Bonus

EXPENSE
├── Food
├── Transport
├── Shopping
└── Entertainment
```

Categories can belong to a specific user or be shared/system categories depending on the implementation.

---

# Transactions

Transactions represent money movement.

Currently supported transaction types:

```text
INCOME
EXPENSE
TRANSFER
```

For normal income and expenses:

```text
INCOME
  ↓
direction = IN

EXPENSE
  ↓
direction = OUT
```

The client does not control the direction.

The backend derives it from the transaction type.

For example:

```json
{
  "type": "EXPENSE"
}
```

becomes:

```text
type = EXPENSE
direction = OUT
```

This prevents clients from sending contradictory values such as:

```text
type = EXPENSE
direction = IN
```

The database also contains constraints to protect this rule.

---

# Authentication

Authentication uses JWT access tokens.

The general flow is:

```text
Login
  ↓
Server validates credentials
  ↓
JWT generated
  ↓
Client stores token
  ↓
Client sends:
Authorization: Bearer <token>
  ↓
Authentication middleware
  ↓
JWT verified
  ↓
userId extracted from token
  ↓
req.userId
```

The server determines the current user from the JWT.

The client does not send the user ID when performing user-owned operations.

For example, the client should not do:

```json
{
  "userId": "..."
}
```

Instead, the server gets the user ID from:

```text
JWT → req.userId
```

---

# Authorization / Ownership

One of the main goals of this project is learning the difference between authentication and authorization.

Authentication answers:

> Who are you?

Authorization answers:

> Are you allowed to access this resource?

For example, when retrieving an account:

```text
GET /accounts/:id
```

the database query checks both:

```text
account.id = requested ID
AND
account.userId = authenticated user
```

The same principle is applied to transactions.

A user cannot retrieve, update, or delete another user's transaction simply by knowing its ID.

Conceptually:

```text
JWT
 ↓
authenticated user ID
 ↓
database query
 ↓
resource ID + user ID
 ↓
resource belongs to user?
 ├── YES → continue
 └── NO  → 404
```

---

# API

The API is versioned under:

```text
/api/v1
```

## User

### Get Current User

```http
GET /api/v1/me
```

Requires authentication.

Example:

```http
Authorization: Bearer <access_token>
```

---

# Accounts

## Create Account

```http
POST /api/v1/accounts
```

Example:

```json
{
  "name": "Primary Bank",
  "type": "BANK",
  "initialBalance": 1000
}
```

---

## Get Accounts

```http
GET /api/v1/accounts
```

Returns accounts belonging to the authenticated user.

---

## Get Account

```http
GET /api/v1/accounts/:id
```

Only the owner can access the account.

---

## Update Account

```http
PATCH /api/v1/accounts/:id
```

Supports partial updates.

Example:

```json
{
  "name": "Main Bank"
}
```

An empty object is rejected by validation.

---

# Categories

Categories are used to classify income and expenses.

Examples:

```text
Salary → INCOME

Food → EXPENSE

Transport → EXPENSE
```

Category ownership is checked before using a category in a transaction.

A transaction also cannot use an `EXPENSE` category with an `INCOME` transaction.

For example:

```text
Transaction:
type = INCOME

Category:
type = EXPENSE
```

is rejected by the backend.

---

# Transactions

## Create Transaction

```http
POST /api/v1/transactions
```

Example expense:

```json
{
  "accountId": "ACCOUNT_ID",
  "categoryId": "CATEGORY_ID",
  "type": "EXPENSE",
  "amount": 25.5,
  "description": "Lunch",
  "transactionDate": "2026-08-30"
}
```

The backend determines:

```text
type = EXPENSE
direction = OUT
```

Example income:

```json
{
  "accountId": "ACCOUNT_ID",
  "categoryId": "CATEGORY_ID",
  "type": "INCOME",
  "amount": 3000,
  "description": "Monthly salary",
  "transactionDate": "2026-08-30"
}
```

The backend determines:

```text
type = INCOME
direction = IN
```

---

## Get Transactions

```http
GET /api/v1/transactions
```

Returns transactions belonging to the authenticated user.

---

## Transaction Filters

Transactions can currently be filtered using query parameters.

### Account

```http
GET /api/v1/transactions?accountId=ACCOUNT_ID
```

### Category

```http
GET /api/v1/transactions?categoryId=CATEGORY_ID
```

### Type

```http
GET /api/v1/transactions?type=EXPENSE
```

or:

```http
GET /api/v1/transactions?type=INCOME
```

### Date Range

```http
GET /api/v1/transactions?from=2026-08-01&to=2026-08-30
```

### Combined Filters

```http
GET /api/v1/transactions?type=EXPENSE&accountId=ACCOUNT_ID
```

Filters can be combined.

---

# Pagination

The transaction endpoint supports pagination.

Example:

```http
GET /api/v1/transactions?page=1&limit=20
```

Default values:

```text
page  = 1
limit = 20
```

Maximum limit:

```text
100
```

Pagination response contains information such as:

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 47,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

# Sorting

Transactions can be sorted by transaction date.

Newest first:

```http
GET /api/v1/transactions?sort=desc
```

Oldest first:

```http
GET /api/v1/transactions?sort=asc
```

The default is:

```text
desc
```

---

# Get Transaction

```http
GET /api/v1/transactions/:id
```

Only the transaction owner can retrieve the transaction.

If the transaction does not belong to the authenticated user:

```text
404 TRANSACTION_NOT_FOUND
```

is returned.

---

# Update Transaction

```http
PATCH /api/v1/transactions/:id
```

Supports partial updates.

Example:

```json
{
  "description": "Updated description"
}
```

Another example:

```json
{
  "amount": 50
}
```

Multiple fields can also be changed:

```json
{
  "amount": 50,
  "description": "Dinner"
}
```

An empty object:

```json
{}
```

is rejected.

The backend also validates account and category ownership when they are changed.

---

# Delete Transaction

```http
DELETE /api/v1/transactions/:id
```

Only the transaction owner can delete it.

Example response:

```json
{
  "message": "Transaction deleted successfully"
}
```

---

# Validation

Request validation is handled using Zod.

Validation is performed before business logic.

The general flow is:

```text
HTTP Request
     ↓
Controller
     ↓
Zod validation
     ↓
Service
     ↓
Repository
     ↓
PostgreSQL
```

Examples of validation currently include:

```text
UUID validation
Amount must be positive
Amount must be finite
String length limits
Enum validation
Date validation
Pagination validation
Empty PATCH body rejection
```

---

# Error Handling

The project uses a custom `AppError` for application-level errors.

Example:

```ts
throw new AppError("Transaction not found", 404, "TRANSACTION_NOT_FOUND");
```

Errors have:

```text
message
status code
error code
```

Example:

```json
{
  "error": {
    "message": "Transaction not found",
    "code": "TRANSACTION_NOT_FOUND"
  }
}
```

---

# Environment Variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development

DATABASE_URL=postgresql://postgres:password@localhost:5432/expense_tracker

JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=15m
```

Never commit `.env` to Git.

Make sure `.env` is included in `.gitignore`.

---

# Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Move into the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create your `.env` file and configure PostgreSQL.

Then run the development server:

```bash
npm run dev
```

---

# Available Scripts

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Start production build:

```bash
npm start
```

Type checking:

```bash
npm run typecheck
```

Lint:

```bash
npm run lint
```

Format:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

---

# Development Architecture

The backend follows a layered architecture:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
```

### Routes

Responsible for mapping HTTP endpoints to controllers.

### Controllers

Responsible for:

- Reading HTTP input
- Validating request data
- Calling services
- Returning HTTP responses

### Services

Responsible for:

- Business logic
- Ownership checks
- Business rules
- Coordinating repositories

### Repositories

Responsible for:

- Database queries
- Inserts
- Updates
- Deletes
- Selecting data

This separation keeps database logic out of controllers and business logic out of routes.

---

# Important Backend Concepts Practiced

This project is intentionally being built step by step.

So far, the project has covered:

### Authentication

```text
JWT
Middleware
Access token
Authenticated request
```

### Authorization

```text
Resource ownership
User-scoped queries
Preventing cross-user access
```

### Database

```text
PostgreSQL
Foreign keys
Enums
Indexes
Unique constraints
Check constraints
Cascade deletes
```

### TypeScript

```text
Typed Express requests
Route parameters
Request body types
Optional properties
Union types
```

### Validation

```text
Zod
Request validation
Query parameter validation
Partial update validation
```

### SQL / Drizzle

```text
SELECT
INSERT
UPDATE
DELETE
WHERE
AND
OR
LIMIT
OFFSET
ORDER BY
COUNT
Date filtering
```

---

# Learning Roadmap

The project is being developed in phases.

```text
Phase 0
Project setup
        ↓
Phase 1
Backend foundation
        ↓
Phase 2
Authentication
        ↓
Phase 3
Users + Accounts
        ↓
Phase 4
Categories
        ↓
Phase 5
Transactions
        ↓
Phase 6
Transfers
        ↓
Phase 7
Financial calculations
        ↓
Phase 8
Reports & dashboard
        ↓
Phase 9
React frontend
        ↓
Phase 10
Testing
        ↓
Phase 11
Production improvements
```

The current implementation is around the **Transactions phase**.

---

# Future Features

The project will eventually support:

- Account-to-account transfers
- Transaction history
- Current account balances
- Income summaries
- Expense summaries
- Monthly financial reports
- Category-based spending analysis
- Dashboard statistics
- Date-based reports
- React frontend
- Authentication UI
- Responsive dashboard
- Automated tests
- API documentation
- Production deployment

---

# Learning Philosophy

This project is intentionally not designed as an overly advanced system.

The goal is to move from:

```text
Basic CRUD
```

to:

```text
Real backend business logic
```

while learning concepts progressively.

The implementation prioritizes understanding over blindly adding libraries or complex architecture.

---

# License

This project is currently for learning and educational purposes.
