require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const initSocket = require('./services/socketService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
   res.json({ status: 'ok', message: 'Trekmate API is running' });
});

// Auth routes
app.use('/api/auth', require('./routes/auth.routes'));

// Trip routes
app.use('/api/trips', require('./routes/trip.routes'));

// Review routes
app.use('/api/trips', require('./routes/review.routes'));

// Chat routes
app.use('/api/trips', require('./routes/chat.routes'));

// Profile routes
app.use('/api/me', require('./routes/profile.routes'));

// Notification routes
app.use('/api/notifications', require('./routes/notification.routes'));

// Ad routes
app.use('/api/ads', require('./routes/ad.routes'));

// Admin routes
app.use('/api/admin/users', require('./routes/admin/users.routes'));
app.use('/api/admin/trips', require('./routes/admin/trips.routes'));
app.use('/api/admin/ads', require('./routes/admin/ads.routes'));

const PORT = process.env.PORT || 5000;

// Create HTTP server and attach Socket.IO
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
   cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
   }
});

// Initialize socket event handlers
initSocket(io);

// Connect to MongoDB and start server
const startServer = async () => {
   await connectDB();
   httpServer.listen(PORT, () => {
      console.log(`Trekmate API running on port ${PORT}`);
      console.log(`Socket.IO enabled`);
   });
};

startServer();
