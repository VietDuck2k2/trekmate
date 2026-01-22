# Trekmate AI Coding Instructions

## Project Architecture

**Trekmate** is a fully-implemented travel application using MERN stack with a three-tier role system (USER, BRAND, ADMIN). The application enables users to create/join trips, brands to post ads, and admins to moderate content.

### Directory Structure

- **`be/`** - Express.js API with JWT auth, Mongoose ODM, notification service
- **`fe/`** - React 19+ with Create React App, Context API, React Router v7

### Core Domain Models

- **User** (`be/src/models/user.model.js`): Three roles (USER/BRAND/ADMIN) with embedded `brandInfo` subdocument for BRAND users. Includes status field for account blocking.
- **Trip** (`be/src/models/trip.model.js`): Travel trips with approval workflow. Fields: `members[]`, `pendingRequests[]`, `status` (ACTIVE/CANCELLED/HIDDEN), `difficulty` (easy/moderate/hard/extreme), cover images via URL.
- **Ad** (`be/src/models/ad.model.js`): Brand advertising with approval workflow. Status: ACTIVE/INACTIVE/PENDING/HIDDEN.
- **Review** (`be/src/models/review.model.js`): Trip reviews with ratings (1-5).
- **Notification** (`be/src/models/notification.model.js`): In-app notifications for join requests/approvals.

## Development Workflow

```bash
# Backend (port 5000) with hot-reload
cd be && npm run dev

# Frontend (port 3000) - proxies API to localhost:5000
cd fe && npm start
```

### Required Environment Variables (`be/.env`)

```
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d  # Optional, defaults to 7d
PORT=5000          # Optional, defaults to 5000
```

## Critical Patterns & Conventions

### Backend Authentication Flow

1. **JWT Generation**: `be/src/utils/jwt.js` exports `generateToken(userId, email, role)` and `verifyToken(token)`
2. **Middleware Chain**: `authMiddleware` (required auth) and `optionalAuthMiddleware` (public endpoints with optional user context)
3. **Authorization Pattern**: After `authMiddleware`, access `req.user` (full User document from DB, not just JWT payload)
4. **Admin Protection**: `be/src/middleware/admin.middleware.js` chains with `authMiddleware` and checks `req.user.role === 'ADMIN'`

### Frontend Authentication Pattern

**Context-Based Auth** (`fe/src/contexts/AuthContext.js`):
- Uses `localStorage` for token/user persistence
- Exposes: `user`, `token`, `login()`, `logout()`, `hasRole(role)`, `isAuthenticated()`, `updateUser()`
- Protected routes use `<ProtectedRoute allowedRoles={['USER', 'ADMIN']}>` wrapper

**API Service Pattern** (`fe/src/services/api.js`):
- All API modules export functions (not classes): `authAPI.login()`, `tripsAPI.getTrips()`, `adminAPI.blockUser()`
- Token injection handled per-request: `headers: { 'Authorization': Bearer ${token} }`
- Error handling: throw `Error(data.message)` for non-ok responses
- Base URL: `process.env.REACT_APP_API_URL` or defaults to `http://localhost:5000/api`

### Notification System Architecture

**Server-Side** (`be/src/services/notificationService.js`):
- Static methods for creating notifications (no class instantiation)
- Used in route handlers: `await NotificationService.createJoinRequestNotifications(trip, requester)`
- Notification types: `JOIN_REQUEST_RECEIVED`, `JOIN_REQUEST_APPROVED`, `JOIN_REQUEST_REJECTED`, `MEMBER_JOINED`

**Client-Side** (`fe/src/contexts/NotificationContext.js`):
- Polls `/api/notifications` every 30 seconds when authenticated
- Provides: `notifications`, `unreadCount`, `markAsRead()`, `markAllAsRead()`

### Trip Join Approval Workflow

1. User requests to join → added to `trip.pendingRequests[]`
2. Organizer/members notified via `NotificationService`
3. Organizer approves → user moved from `pendingRequests[]` to `members[]`
4. Requester receives approval notification

**Backend Implementation**: See `be/src/routes/trip.routes.js` - routes for `/api/trips/:id/join`, `/api/trips/:id/approve/:userId`, `/api/trips/:id/reject/:userId`

## Routing Conventions

### Backend Route Structure

All routes mounted in `be/src/index.js` with `/api` prefix:
- `/api/auth` - register, login
- `/api/trips` - CRUD + join workflow + search (supports `?search=`, `?location=`, `?difficulty=`, `?dateFrom=`, `?dateTo=`)
- `/api/trips/:id/reviews` - trip reviews (nested under trips)
- `/api/me` - current user profile
- `/api/notifications` - user notifications
- `/api/ads` - brand ad CRUD
- `/api/admin/{users,trips,ads}` - admin moderation endpoints

### Frontend Route Order (CRITICAL)

In `fe/src/App.js`, **specific routes MUST come before parameterized routes**:

```javascript
// ✅ CORRECT ORDER
<Route path="/trips/create" element={...} />
<Route path="/trips/:id/edit" element={...} />
<Route path="/trips/:id" element={...} />  // Must be last

// ❌ WRONG - :id will match "create"
<Route path="/trips/:id" element={...} />
<Route path="/trips/create" element={...} />
```

## Data Fetching Patterns

### Pagination & Filtering

Backend queries use consistent pagination:
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const trips = await Trip.find(filter)
   .skip(skip)
   .limit(limit)
   .sort({ createdAt: -1 });

const total = await Trip.countDocuments(filter);
```

Frontend services return `{ data, pagination: { total, page, limit } }` or similar structures.

### Search Implementation

Text search uses MongoDB regex (case-insensitive):
```javascript
if (search) {
   filter.$or = [
      { title: new RegExp(search.trim(), 'i') },
      { description: new RegExp(search.trim(), 'i') }
   ];
}
```

## Admin Features

Admin routes (`be/src/routes/admin/*.routes.js`) require both `authMiddleware` and `adminMiddleware`:
```javascript
router.put('/users/:id/block', authMiddleware, adminMiddleware, async (req, res) => {...});
```

Admin can:
- Block/unblock users (sets `user.status = 'BLOCKED'`)
- Hide/unhide trips and ads (sets `status = 'HIDDEN'`)
- View all content regardless of status

## Styling Approach

- **Global Styles**: `fe/src/styles/global.css` - base styles, utility classes
- **Component Styles**: Component-specific CSS files (e.g., `Navbar.css`)
- **Tailwind**: Configured but minimally used (postcss.config.js, tailwind.config.js present)
- **Image Handling**: Cover images via URL fields (no file upload implemented)

## Testing

Frontend only: `cd fe && npm test` (React Testing Library + Jest)

## Key Files for Understanding

- **Backend Entry**: `be/src/index.js` - shows all route mounts and middleware order
- **Auth Flow**: `be/src/middleware/auth.middleware.js` + `be/src/utils/jwt.js`
- **Trip Logic**: `be/src/routes/trip.routes.js` (688 lines - join workflow, CRUD, search)
- **Frontend Auth**: `fe/src/contexts/AuthContext.js` + `fe/src/components/ProtectedRoute.js`
- **API Layer**: `fe/src/services/api.js` (459 lines - all API endpoints)

## Common Pitfalls

1. **Route Order**: Always place specific routes before parameterized ones in React Router
2. **Token Format**: Backend expects `Authorization: Bearer <token>` (note the space)
3. **User Status**: Check `user.status !== 'BLOCKED'` in auth middleware - blocked users can't access protected routes
4. **ObjectId Comparison**: Use `.toString()` when comparing Mongoose ObjectIds
5. **Proxy Setup**: Frontend `package.json` has `"proxy": "http://localhost:5000"` for Create React App's built-in proxying
