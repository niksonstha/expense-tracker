# Expense Tracker

A full-stack personal finance application for managing accounts, transactions, transfers, balances, and financial summaries.

The project is built with a TypeScript/Node.js backend and is being developed with a React frontend.

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Protected API routes
- Password hashing with bcrypt

### Accounts

- Create accounts
- View account details
- Update accounts
- Delete accounts
- Account ownership protection
- Account balance calculations
- Supported account types:
  - Bank
  - Savings
  - Cash
  - Credit Card

### Transactions

- Create income transactions
- Create expense transactions
- Update transactions
- Delete transactions
- View individual transactions
- List transactions with pagination
- Filter by account
- Filter by category
- Filter by transaction type
- Filter by date range
- Sort by transaction date
- Transaction ownership protection

### Transfers

- Transfer money between accounts
- Creates outgoing and incoming transaction records
- Uses database transactions to keep transfer operations atomic
- Transfer ownership protection

### Categories

- Income categories
- Expense categories
- User-specific categories
- Category type validation

### Financial Summaries

- Total balance
- Total income
- Total expenses
- Monthly income
- Monthly expenses
- Monthly net balance
- Spending by category
- Spending percentages

### Dashboard

- Financial summary
- Account balances
- Recent transactions
- Current-month spending breakdown

### API Security & Reliability

- Helmet
- CORS
- Rate limiting
- Request body size limits
- Environment variable validation
- Graceful server shutdown
- PostgreSQL connection pooling
- Centralized error handling
- Request IDs
- Input validation with Zod

### Testing

- Authentication tests
- Account ownership tests
- Transaction ownership tests
- Transfer tests

## Tech Stack

### Backend

- Node.js
- TypeScript
- Express
- PostgreSQL
- Drizzle ORM
- Zod
- JWT
- bcrypt
- Helmet
- CORS
- Vitest
- Supertest

### Frontend

- React
- TypeScript
- Vite

> The React frontend is currently under development.

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
└── frontend/
    └── ...
```

## Backend Setup

Clone the repository:

```bash
git clone <your-repository-url>
cd expense-tracker/backend
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

If you have seed data configured:

```bash
npm run db:seed
```

## Running the Backend

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

The API will be available at:

```text
http://localhost:3000
```

Health check:

```text
GET /health
```

## API

The API is versioned under:

```text
/api/v1
```

Authentication:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
```

Accounts:

```text
POST   /api/v1/account
GET    /api/v1/account/:id
GET    /api/v1/account
PATCH  /api/v1/account/:id
DELETE /api/v1/account/:id
```

Transactions:

```text
POST   /api/v1/transactions
GET    /api/v1/transactions
GET    /api/v1/transactions/:id
PATCH  /api/v1/transactions/:id
DELETE /api/v1/transactions/:id
```

Transfers:

```text
POST /api/v1/transfers
GET  /api/v1/transfers/:id
```

Financial summaries and dashboard endpoints are also available under the versioned API.

Authenticated endpoints require:

```http
Authorization: Bearer <access-token>
```

## Database

The application uses PostgreSQL with Drizzle ORM.

Useful database commands:

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
npm run db:seed
```

The database contains relationships between:

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
   └── IN transaction  → destination account
```

The transfer operation is performed inside a PostgreSQL database transaction to prevent partial transfers.

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The tests cover important security and business rules such as:

- Authentication
- Account ownership
- Transaction ownership
- Transfer creation
- Cross-user resource access prevention

## Environment Variables

The backend validates required environment variables when the application starts.

Required variables:

```env
NODE_ENV
PORT
DATABASE_URL
JWT_SECRET
FRONTEND_URL
```

Do not commit your `.env` file.

Make sure `.env` is included in `.gitignore`.

## Security

The application includes several security measures:

- Passwords are never stored as plain text.
- JWT authentication protects private routes.
- Resources are scoped to the authenticated user.
- Zod validates incoming data.
- Rate limiting protects API endpoints.
- Helmet adds HTTP security headers.
- CORS restricts frontend access.
- Request body size is limited.
- Database operations use parameterized queries through Drizzle ORM.
- Database transactions are used for multi-step transfer operations.

## Development Roadmap

### Backend

- [x] Authentication
- [x] Accounts
- [x] Transactions
- [x] Categories
- [x] Account balances
- [x] Account-to-account transfers
- [x] Database transactions
- [x] Financial summaries
- [x] Dashboard APIs
- [x] Monthly financial summaries
- [x] Spending analysis
- [x] Automated tests
- [x] Production hardening

### Frontend

- [ ] React application
- [ ] Authentication UI
- [ ] Login/Register
- [ ] Dashboard
- [ ] Account management
- [ ] Transaction management
- [ ] Transfer management
- [ ] Categories
- [ ] Financial summaries
- [ ] Spending charts
- [ ] Loading and error states
- [ ] Responsive design

## Future Improvements

Possible future improvements include:

- Refresh tokens
- Email verification
- Password reset
- Advanced reporting
- CSV import/export
- CSV/PDF financial reports
- Recurring transactions
- Budget management
- Notifications
- More detailed analytics
- Deployment with CI/CD
- Automated database backups

## License

This project is currently for learning and personal development purposes.
