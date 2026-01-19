const express = require('express');
const User = require('../models/user.model');
const Trip = require('../models/trip.model');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * GET /api/me/profile
 * Get current user's profile information with stats
 */
router.get('/profile', authMiddleware, async (req, res) => {
   try {
      const userId = req.user._id;

      // Get user profile info
      const user = await User.findById(userId).select('-passwordHash');
      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found'
         });
      }

      // Get trip stats
      const totalCreatedTrips = await Trip.countDocuments({
         createdBy: userId
      });

      const totalJoinedTrips = await Trip.countDocuments({
         members: userId
      });

      res.json({
         success: true,
         profile: {
            ...user.toJSON(),
            stats: {
               totalCreatedTrips,
               totalJoinedTrips
            }
         }
      });
   } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching profile'
      });
   }
});

/**
 * PUT /api/me/profile
 * Update current user's profile information
 */
router.put('/profile', authMiddleware, async (req, res) => {
   try {
      const userId = req.user._id;
      const { displayName, location, bio, experienceLevel, avatarUrl } = req.body;

      // Build update object with only allowed fields
      const updateData = {};
      if (displayName !== undefined) updateData.displayName = displayName;
      if (location !== undefined) updateData.location = location;
      if (bio !== undefined) updateData.bio = bio;
      if (experienceLevel !== undefined) {
         if (!['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(experienceLevel)) {
            return res.status(400).json({
               success: false,
               message: 'Invalid experience level'
            });
         }
         updateData.experienceLevel = experienceLevel;
      }
      if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

      // Validate displayName if provided
      if (displayName && displayName.trim().length < 1) {
         return res.status(400).json({
            success: false,
            message: 'Display name cannot be empty'
         });
      }

      const updatedUser = await User.findByIdAndUpdate(
         userId,
         updateData,
         { new: true, select: '-passwordHash' }
      );

      if (!updatedUser) {
         return res.status(404).json({
            success: false,
            message: 'User not found'
         });
      }

      res.json({
         success: true,
         message: 'Profile updated successfully',
         user: updatedUser
      });
   } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
         success: false,
         message: 'Error updating profile'
      });
   }
});

/**
 * GET /api/me/notifications
 * Get join request notifications for current user
 */
router.get('/notifications', authMiddleware, async (req, res) => {
   try {
      const userId = req.user._id;

      // Get organizer notifications - trips where user is organizer with pending join requests
      const organizerTrips = await Trip.find({
         createdBy: userId,
         'joinRequests.status': 'PENDING'
      })
         .populate('joinRequests.user', 'displayName avatarUrl')
         .select('_id title joinRequests');

      const organizerNotifications = [];
      organizerTrips.forEach(trip => {
         const pendingRequests = trip.joinRequests.filter(req => req.status === 'PENDING');
         pendingRequests.forEach(request => {
            organizerNotifications.push({
               tripId: trip._id,
               tripTitle: trip.title,
               requester: {
                  id: request.user._id,
                  name: request.user.displayName,
                  avatar: request.user.avatarUrl
               },
               createdAt: request.createdAt,
               message: request.message
            });
         });
      });

      // Get my request status notifications - join requests made by current user
      const myRequestTrips = await Trip.find({
         'joinRequests.user': userId
      })
         .populate('createdBy', 'displayName')
         .select('_id title createdBy joinRequests');

      const myRequestNotifications = [];
      myRequestTrips.forEach(trip => {
         const myRequest = trip.joinRequests.find(req => req.user.toString() === userId.toString());
         if (myRequest) {
            myRequestNotifications.push({
               tripId: trip._id,
               tripTitle: trip.title,
               organizerName: trip.createdBy.displayName,
               status: myRequest.status,
               createdAt: myRequest.createdAt,
               updatedAt: myRequest.updatedAt || myRequest.createdAt
            });
         }
      });

      res.json({
         success: true,
         notifications: {
            organizer: organizerNotifications,
            myRequests: myRequestNotifications,
            totalCount: organizerNotifications.length + myRequestNotifications.filter(req => req.status !== 'PENDING').length
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

module.exports = router;