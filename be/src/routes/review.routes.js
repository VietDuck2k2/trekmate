const express = require('express');
const Review = require('../models/review.model');
const Trip = require('../models/trip.model');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * GET /api/trips/:id/reviews
 * Get all reviews for a specific trip
 */
router.get('/:tripId/reviews', async (req, res) => {
   try {
      const { tripId } = req.params;

      const reviews = await Review.find({ trip: tripId })
         .populate('user', 'displayName avatarUrl')
         .sort({ createdAt: -1 });

      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

      res.json({
         success: true,
         reviews,
         stats: {
            totalReviews: reviews.length,
            averageRating: parseFloat(averageRating)
         }
      });
   } catch (error) {
      console.error('Get reviews error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching reviews'
      });
   }
});

/**
 * POST /api/trips/:id/reviews
 * Create a new review for a trip
 */
router.post('/:tripId/reviews', authMiddleware, async (req, res) => {
   try {
      const { tripId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user._id;

      // Validate input
      if (!rating || rating < 1 || rating > 5) {
         return res.status(400).json({
            success: false,
            message: 'Rating must be between 1 and 5'
         });
      }

      // Check if trip exists
      const trip = await Trip.findById(tripId);
      if (!trip) {
         return res.status(404).json({
            success: false,
            message: 'Trip not found'
         });
      }

      // Check if user was a member of this trip
      const isMember = trip.members.includes(userId) || trip.createdBy.equals(userId);
      if (!isMember) {
         return res.status(403).json({
            success: false,
            message: 'You must be a member of this trip to leave a review'
         });
      }

      // Check if trip is completed (past end date)
      const now = new Date();
      if (trip.endDate && trip.endDate > now) {
         return res.status(400).json({
            success: false,
            message: 'You can only review completed trips'
         });
      }

      // Check if user already reviewed this trip
      const existingReview = await Review.findOne({ trip: tripId, user: userId });
      if (existingReview) {
         return res.status(400).json({
            success: false,
            message: 'You have already reviewed this trip. Use PUT to update your review.'
         });
      }

      // Create new review
      const review = new Review({
         trip: tripId,
         user: userId,
         rating: parseInt(rating),
         comment: comment?.trim()
      });

      await review.save();
      await review.populate('user', 'displayName avatarUrl');

      res.status(201).json({
         success: true,
         message: 'Review created successfully',
         review
      });
   } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({
         success: false,
         message: 'Error creating review'
      });
   }
});

/**
 * PUT /api/trips/:id/reviews
 * Update user's existing review for a trip
 */
router.put('/:tripId/reviews', authMiddleware, async (req, res) => {
   try {
      const { tripId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user._id;

      // Validate input
      if (!rating || rating < 1 || rating > 5) {
         return res.status(400).json({
            success: false,
            message: 'Rating must be between 1 and 5'
         });
      }

      // Find existing review
      const review = await Review.findOne({ trip: tripId, user: userId });
      if (!review) {
         return res.status(404).json({
            success: false,
            message: 'Review not found. Use POST to create a new review.'
         });
      }

      // Update review
      review.rating = parseInt(rating);
      review.comment = comment?.trim();
      await review.save();
      await review.populate('user', 'displayName avatarUrl');

      res.json({
         success: true,
         message: 'Review updated successfully',
         review
      });
   } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({
         success: false,
         message: 'Error updating review'
      });
   }
});

/**
 * GET /api/trips/:id/reviews/me
 * Get current user's review for a specific trip
 */
router.get('/:tripId/reviews/me', authMiddleware, async (req, res) => {
   try {
      const { tripId } = req.params;
      const userId = req.user._id;

      const review = await Review.findOne({ trip: tripId, user: userId })
         .populate('user', 'displayName avatarUrl');

      res.json({
         success: true,
         review
      });
   } catch (error) {
      console.error('Get user review error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching your review'
      });
   }
});

module.exports = router;