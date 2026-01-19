const express = require('express');
const Notification = require('../models/notification.model');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * GET /api/notifications
 * Get current user's notifications
 */
router.get('/', authMiddleware, async (req, res) => {
   try {
      const { unread, limit = 20, page = 1 } = req.query;
      const skip = (page - 1) * limit;
      
      // Build filter
      const filter = { user: req.user._id };
      if (unread === 'true') {
         filter.isRead = false;
      }

      const notifications = await Notification.find(filter)
         .populate('trip', 'title')
         .populate('fromUser', 'displayName avatarUrl')
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(parseInt(limit));

      const totalUnread = await Notification.countDocuments({
         user: req.user._id,
         isRead: false
      });

      res.json({
         success: true,
         notifications,
         totalUnread,
         pagination: {
            current: parseInt(page),
            limit: parseInt(limit),
            hasMore: notifications.length === parseInt(limit)
         }
      });
   } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching notifications'
      });
   }
});

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 */
router.patch('/:id/read', authMiddleware, async (req, res) => {
   try {
      const notification = await Notification.findOneAndUpdate(
         { 
            _id: req.params.id, 
            user: req.user._id 
         },
         { isRead: true },
         { new: true }
      );

      if (!notification) {
         return res.status(404).json({
            success: false,
            message: 'Notification not found'
         });
      }

      res.json({
         success: true,
         message: 'Notification marked as read',
         notification
      });
   } catch (error) {
      console.error('Mark notification as read error:', error);
      res.status(500).json({
         success: false,
         message: 'Error marking notification as read'
      });
   }
});

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read
 */
router.patch('/read-all', authMiddleware, async (req, res) => {
   try {
      const result = await Notification.updateMany(
         { user: req.user._id, isRead: false },
         { isRead: true }
      );

      res.json({
         success: true,
         message: `Marked ${result.modifiedCount} notifications as read`,
         modifiedCount: result.modifiedCount
      });
   } catch (error) {
      console.error('Mark all notifications as read error:', error);
      res.status(500).json({
         success: false,
         message: 'Error marking notifications as read'
      });
   }
});

module.exports = router;