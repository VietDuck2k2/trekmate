const { verifyToken } = require('../utils/jwt');
const User = require('../models/user.model');

/**
 * Authentication middleware
 * Verifies JWT token and adds user to req.user
 */
const authMiddleware = async (req, res, next) => {
   try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return res.status(401).json({
            success: false,
            message: 'Access token required'
         });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const decoded = verifyToken(token);

      // Get user from database
      const user = await User.findById(decoded.userId);
      if (!user) {
         return res.status(401).json({
            success: false,
            message: 'Invalid token - user not found'
         });
      }

      // Check if user account is blocked
      if (user.status === 'BLOCKED') {
         return res.status(403).json({
            success: false,
            message: 'Account is blocked. Please contact support.'
         });
      }

      req.user = user;
      next();
   } catch (error) {
      // Log the specific JWT error type for easier debugging
      const errType = error.name === 'TokenExpiredError'
         ? 'Token expired'
         : error.name === 'JsonWebTokenError'
            ? `JWT error: ${error.message}`
            : error.message;
      console.error('[Auth] Failed to authenticate:', errType);
      res.status(401).json({
         success: false,
         message: 'Invalid or expired token'
      });
   }
};

/**
 * Optional authentication middleware
 * Adds user to req.user if token exists, but doesn't require it
 */
const optionalAuthMiddleware = async (req, res, next) => {
   try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         req.user = null;
         return next();
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      const user = await User.findById(decoded.userId);

      // If user exists but is blocked, treat as no user (don't expose blocked status in optional middleware)
      req.user = (user && user.status !== 'BLOCKED') ? user : null;

      next();
   } catch (error) {
      req.user = null;
      next();
   }
};

module.exports = {
   authMiddleware,
   optionalAuthMiddleware
};