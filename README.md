# Employee Status Management System

A full-stack employee status management application built with NestJS and React.

## Features

- **List all employees** with profile avatars
- **Create new employees** via modal form
- **Update employee status** using dropdown on each card
- **Delete employees** with confirmation
- **Modern UI** with light theme, cards, and status indicators
- **SQLite support** for easy development (no DB setup required)
- **PostgreSQL support** for production (via environment variables) 
## Tech Stack

- **Backend**: NestJS + TypeORM + SQLite (default) / PostgreSQL (optional)
- **Frontend**: React + Vite + TypeScript
- **Database**: SQLite (default) or PostgreSQL (via env vars)

## Quick Start

### Prerequisites

- Node.js 18+ installed

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

   The server will start on `http://localhost:3000` and automatically create a SQLite database file (`employees.db`) in the backend directory.

   **Optional**: To use PostgreSQL instead, create a `.env` file in the `backend` directory:
   ```env
   DB_HOST=your-postgres-host
   DB_PORT=5432
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=employees
   ```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to the URL shown (typically `http://localhost:5173`)

## API Endpoints

- **GET** `/employees` - Get all employees
- **POST** `/employees` - Create a new employee
  ```json
  {
    "name": "John Doe",
    "title": "Software Engineer",
    "status": "Working"
  }
  ```
- **PATCH** `/employees/:id/status` - Update employee status
  ```json
  {
    "status": "OnVacation"
  }
  ```
- **DELETE** `/employees/:id` - Delete an employee
- **POST** `/employees/:id/avatar` - Upload profile picture
  - Form data with `file` field (image file, max 5MB)

## Employee Statuses

- `Working` - Employee is currently working
- `OnVacation` - Employee is on vacation
- `LunchTime` - Employee is on lunch break
- `BusinessTrip` - Employee is on a business trip

## Project Structure

```
home-exercise/
├── backend/          # NestJS API server
│   ├── src/
│   │   ├── employees/    # Employee module (entity, service, controller)
│   │   └── app.module.ts
│   └── employees.db      # SQLite database (auto-created)
└── frontend/         # React application
    └── src/
        ├── App.tsx    # Main component
        └── App.css   # Styles
```

## Troubleshooting

### Backend won't start / Database connection errors

- If using SQLite (default): The database file will be created automatically. Make sure the `backend` directory is writable.
- If using PostgreSQL: Verify your connection details in the `.env` file and ensure PostgreSQL is running.

### Frontend can't connect to backend

- Make sure the backend is running on `http://localhost:3000`
- Check browser console for CORS errors
- Verify the `API_BASE` constant in `frontend/src/App.tsx` matches your backend URL

### Can't create employees

- Check that the backend is running and accessible
- Open browser DevTools (F12) and check the Network tab for API errors
- Verify the backend logs for any error messages

## Testing

### Unit Tests

Run unit tests:
```bash
cd backend
npm test
```

Unit tests cover:
- `EmployeesService` - all CRUD operations
- `EmployeesController` - all endpoints

### E2E Tests

Run end-to-end tests:
```bash
cd backend
npm run test:e2e
```

E2E tests cover:
- Creating employees
- Listing employees
- Updating employee status
- Deleting employees
- Uploading profile pictures

## Bonus Features (Implemented)

- **Profile picture upload** - Click the camera icon on any employee card to upload a photo
- **Unit tests** - Comprehensive test coverage for service and controller
- **E2E tests** - Full API endpoint testing

