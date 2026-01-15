const { authMiddleware } = require('./auth.middleware');

/**
 * Admin-only middleware
 * Requires authentication and ADMIN role
 */
const adminMiddleware = async (req, res, next) => {
   // First run the regular auth middleware
   await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => {
         if (err) reject(err);
         else resolve();
      });
   }).catch(() => {
      return res.status(401).json({
         success: false,
         message: 'Authentication required'
      });
   });

   // Check if user has admin role
   if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
         success: false,
         message: 'Admin access required'
      });
   }

   next();
};

module.exports = {
   adminMiddleware
};