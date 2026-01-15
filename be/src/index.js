require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

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

// Ad routes
app.use('/api/ads', require('./routes/ad.routes'));

// Admin routes
app.use('/api/admin/users', require('./routes/admin/users.routes'));
app.use('/api/admin/trips', require('./routes/admin/trips.routes'));
app.use('/api/admin/ads', require('./routes/admin/ads.routes'));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
   await connectDB();
   app.listen(PORT, () => {
      console.log(`Trekmate API running on port ${PORT}`);
   });
};

startServer();
