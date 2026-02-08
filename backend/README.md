# Backend API

NestJS server for the Employee Management System.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server (dev mode):
   ```bash
   npm run start:dev
   ```
   The server runs on http://localhost:3000.

## Configuration

Create a `.env` file in this folder if you want to connect to a real database (PostgreSQL).
You can see an example in `.env.example`.

If no `.env` is found, the app will throw an error (as per requirement to use Postgres).

## Tests

- Run unit tests: `npm test`
- Run e2e tests: `npm run test:e2e`
