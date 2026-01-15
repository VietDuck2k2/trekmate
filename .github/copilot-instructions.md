# Trekmate AI Coding Instructions

## Project Architecture

**Trekmate** is a travel application with a classic MERN stack split into two main directories:

- **`be/`** - Express.js API server with MongoDB (via Mongoose)
- **`fe/`** - React frontend (Create React App)

The backend serves API endpoints under `/api/*` prefix, with CORS enabled for cross-origin communication with the React frontend.

## Development Workflow

### Starting the Application

```bash
# Backend (runs on port 5000 by default)
cd be && npm run dev  # Uses nodemon for auto-restart
# or npm start for production

# Frontend (runs on port 3000)
cd fe && npm start
```

### Environment Configuration

Backend uses `.env` file in `be/` directory:

- `PORT` - API server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string

## Code Patterns & Conventions

### Backend (Express.js)

- **Entry Point**: `be/src/index.js` - minimal Express setup with CORS and JSON middleware
- **Environment**: Uses `dotenv` loaded at app startup
- **Database**: Mongoose for MongoDB (connection string in `.env`)
- **API Structure**: All routes prefixed with `/api/` (see health check example)
- **Comments**: Vietnamese TODO comments indicate planned features (`thêm routes cho users, trips, ads sau`)

### Frontend (React)

- **Standard CRA Structure**: Follows Create React App conventions
- **Entry Point**: `fe/src/index.js` with React 19+ `createRoot`
- **Main Component**: `fe/src/App.js` - currently showing default CRA boilerplate
- **Testing**: Configured with Testing Library suite

## Key Integration Points

- **API Communication**: Frontend will make requests to `http://localhost:5000/api/*`
- **Health Check**: `GET /api/health` endpoint for service status
- **Future Routes**: Backend has TODOs for users, trips, and ads functionality

## Project-Specific Notes

- **Language Mix**: Comments contain Vietnamese, indicating bilingual development team
- **Early Stage**: Both frontend and backend are largely boilerplate - core business logic not yet implemented
- **Travel Domain**: Project name "Trekmate" suggests travel/trip management functionality
- **Database**: MongoDB setup but no schemas/models defined yet

## Quick Commands Reference

```bash
# Install dependencies
cd be && npm install
cd fe && npm install

# Development servers
cd be && npm run dev    # Backend with nodemon
cd fe && npm start      # Frontend with hot reload

# Production build
cd fe && npm run build  # Creates optimized build in fe/build/

# Test frontend
cd fe && npm test
```

When adding new features, follow the planned structure: users, trips, and ads as main entities. Backend routes should follow RESTful patterns under `/api/` prefix.
