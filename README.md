# Messaging Campaigns

This project is a small full-stack service to create and execute bulk messaging campaigns (SMS / WhatsApp), built as a take-home exercise.  
It is organized as a lightweight monorepo with a backend API and a React frontend.

It allows users to create campaigns, upload recipients via CSV, execute campaigns in the background, monitor delivery status, and cancel running campaigns.

---

## Project structure

- `apps/api`  
  HTTP API responsible for:
  - storing campaigns and recipients
  - executing campaigns in the background
  - handling campaign cancellation

- `apps/web`  
  React frontend used to:
  - create campaigns
  - upload recipients via CSV
  - execute and cancel campaigns
  - monitor campaign progress

For the scope of this exercise, the service uses **SQLite** as a lightweight embedded database to persist campaigns and recipients between restarts.  
In a production environment, this would likely be replaced by a managed relational database (e.g. PostgreSQL) and a dedicated background job system.

---

## Setup

### 1. Install dependencies

From the repository root:

```bash
npm run install:all
```

This installs dependencies for both the backend API and the frontend application.

### 2. Environment variables

The frontend uses Vite environment variables.

Create a local env file:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Adjust values if needed.

### 3. (Optional) Reset the database

If you want to start from a clean state:

```bash
npm run reset-db
```

Make sure the backend server is not running when resetting the database.

## Development

Start both backend and frontend:

```bash
npm run dev
```

This will start:

Backend API on http://localhost:3001

Frontend on http://localhost:5173

## Notes on architecture and design choices

- Campaign execution and cancellation are handled server-side, reflecting a more realistic background execution model.

- Messaging is sent through a simulated third-party HTTP API, following the provided specification.

- The implementation prioritizes clarity and correctness within the constraints of a take-home exercise, rather than production-level scalability.
