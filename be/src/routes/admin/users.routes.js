const express = require('express');
const User = require('../../models/user.model');
const { adminMiddleware } = require('../../middleware/admin.middleware');

const router = express.Router();

/**
 * GET /api/admin/users
 * List all users with filtering options
 */
router.get('/', adminMiddleware, async (req, res) => {
   try {
      const { role, status, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      // Build filter object
      const filter = {};
      if (role) filter.role = role;
      if (status) filter.status = status;

      const users = await User.find(filter)
         .select('-passwordHash') // Exclude password hash
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(parseInt(limit));

      const total = await User.countDocuments(filter);

      res.json({
         success: true,
         users,
         pagination: {
            current: parseInt(page),
            total: Math.ceil(total / limit),
            count: users.length,
            totalUsers: total
         }
      });
   } catch (error) {
      console.error('Admin list users error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching users'
      });
   }
});

/**
 * GET /api/admin/users/:id
 * Get detailed user information
 */
router.get('/:id', adminMiddleware, async (req, res) => {
   try {
      const user = await User.findById(req.params.id).select('-passwordHash');

      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found'
         });
      }

      res.json({
         success: true,
         user
      });
   } catch (error) {
      console.error('Admin get user error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching user details'
      });
   }
});

/**
 * PATCH /api/admin/users/:id/block
 * Block a user account
 */
router.patch('/:id/block', adminMiddleware, async (req, res) => {
   try {
      const user = await User.findById(req.params.id);

      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found'
         });
      }

      // Don't allow blocking other admins
      if (user.role === 'ADMIN') {
         return res.status(400).json({
            success: false,
            message: 'Cannot block admin users'
         });
      }

      user.status = 'BLOCKED';
      await user.save();

      res.json({
         success: true,
         message: 'User blocked successfully',
         user: {
            _id: user._id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            status: user.status
         }
      });
   } catch (error) {
      console.error('Admin block user error:', error);
      res.status(500).json({
         success: false,
         message: 'Error blocking user'
      });
   }
});

/**
 * PATCH /api/admin/users/:id/unblock
 * Unblock a user account
 */
router.patch('/:id/unblock', adminMiddleware, async (req, res) => {
   try {
      const user = await User.findById(req.params.id);

      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found'
         });
      }

      user.status = 'ACTIVE';
      await user.save();

      res.json({
         success: true,
         message: 'User unblocked successfully',
         user: {
            _id: user._id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            status: user.status
         }
      });
   } catch (error) {
      console.error('Admin unblock user error:', error);
      res.status(500).json({
         success: false,
         message: 'Error unblocking user'
      });
   }
});

/**
 * GET /api/admin/users/stats
 * Get user statistics
 */
router.get('/stats/overview', adminMiddleware, async (req, res) => {
   try {
      const stats = await Promise.all([
         User.countDocuments({ role: 'USER' }),
         User.countDocuments({ role: 'BRAND' }),
         User.countDocuments({ role: 'ADMIN' }),
         User.countDocuments({ status: 'ACTIVE' }),
         User.countDocuments({ status: 'BLOCKED' }),
         User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }) // Last 30 days
      ]);

      res.json({
         success: true,
         stats: {
            totalUsers: stats[0],
            totalBrands: stats[1],
            totalAdmins: stats[2],
            activeUsers: stats[3],
            blockedUsers: stats[4],
            newUsersLast30Days: stats[5]
         }
      });
   } catch (error) {
      console.error('Admin user stats error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching user statistics'
      });
   }
});

module.exports = router;