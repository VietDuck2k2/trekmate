# SKILL: Analyze Trekmate Project

This skill analyzes the Trekmate project's source code to provide a comprehensive overview of its business logic, API endpoints, UI components, and technology stack.

## Workflow

### 1. Analyze Backend (`be/`)

- **Identify Technologies:**
  - Read `be/package.json` and list the main dependencies under `dependencies` to identify the backend technology stack (e.g., Express, Mongoose, JWT, etc.).

- **Map API Endpoints & Business Logic:**
  - List all files in `be/src/routes/` and `be/src/routes/admin/`.
  - For each route file, read its content to summarize the defined API endpoints (e.g., `GET /api/trips`, `POST /api/auth/login`).
  - Read the contents of all files in `be/src/models/` to understand the data schema for Users, Trips, Ads, Reviews, etc.
  - Read the contents of files in `be/src/services/` (like `notificationService.js`) to understand background or complex business logic.

### 2. Analyze Frontend (`fe/`)

- **Identify Technologies:**
  - Read `fe/package.json` and list the main dependencies to identify the frontend technology stack (e.g., React, React Router, Axios, Tailwind CSS).

- **Map UI Components and Pages:**
  - List all files in `fe/src/pages/` to identify the main pages of the application.
  - List all files in `fe/src/components/` to get an overview of the reusable UI components.
  - Read the content of `fe/src/App.js` to understand the main routing structure.

- **Analyze Frontend Logic:**
  - Read files in `fe/src/services/` (e.g., `api.js`, `chatAPI.js`) to understand how the frontend communicates with the backend API.
  - Read files in `fe/src/contexts/` (e.g., `AuthContext.js`, `NotificationContext.js`) to understand how global state is managed.

### 3. Synthesize and Report

- **Summarize Business Flows:**
  - Based on the analysis of routes, models, pages, and services, create a summary of the main business flows implemented. Examples:
    - User Authentication (Register, Login, Logout)
    - Trip Management (Create, View, List)
    - Advertising (Create Ad, View Ads)
    - Real-time Chat & Notifications

- **Provide a Technology Stack Overview:**
  - Compile a final list of all major technologies, libraries, and frameworks used across the `be` and `fe` stacks.

- **Present the Final Report:**
  - Structure the information clearly with sections for Backend, Frontend, Business Flows, and Technology Stack.
  - Use markdown for clear formatting.
