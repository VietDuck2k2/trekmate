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

module.exports = router;