const express = require('express');
const Trip = require('../../models/trip.model');
const { adminMiddleware } = require('../../middleware/admin.middleware');

const router = express.Router();

/**
 * GET /api/admin/trips
 * List all trips (including hidden ones)
 */
router.get('/', adminMiddleware, async (req, res) => {
   try {
      const { status, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      // Build filter object
      const filter = {};
      if (status) filter.status = status;

      const trips = await Trip.find(filter)
         .populate('createdBy', 'displayName email role status')
         .populate('members', 'displayName email')
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(parseInt(limit));

      const total = await Trip.countDocuments(filter);

      res.json({
         success: true,
         trips,
         pagination: {
            current: parseInt(page),
            total: Math.ceil(total / limit),
            count: trips.length,
            totalTrips: total
         }
      });
   } catch (error) {
      console.error('Admin list trips error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching trips'
      });
   }
});

/**
 * GET /api/admin/trips/:id
 * Get detailed trip information
 */
router.get('/:id', adminMiddleware, async (req, res) => {
   try {
      const trip = await Trip.findById(req.params.id)
         .populate('createdBy', 'displayName email role status bio location')
         .populate('members', 'displayName email role');

      if (!trip) {
         return res.status(404).json({
            success: false,
            message: 'Trip not found'
         });
      }

      res.json({
         success: true,
         trip
      });
   } catch (error) {
      console.error('Admin get trip error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching trip details'
      });
   }
});

/**
 * PATCH /api/admin/trips/:id/hide
 * Hide a trip (set status to HIDDEN)
 */
router.patch('/:id/hide', adminMiddleware, async (req, res) => {
   try {
      const trip = await Trip.findById(req.params.id);

      if (!trip) {
         return res.status(404).json({
            success: false,
            message: 'Trip not found'
         });
      }

      trip.status = 'HIDDEN';
      await trip.save();

      res.json({
         success: true,
         message: 'Trip hidden successfully',
         trip: {
            _id: trip._id,
            title: trip.title,
            status: trip.status,
            createdBy: trip.createdBy
         }
      });
   } catch (error) {
      console.error('Admin hide trip error:', error);
      res.status(500).json({
         success: false,
         message: 'Error hiding trip'
      });
   }
});

/**
 * PATCH /api/admin/trips/:id/unhide
 * Unhide a trip (restore to ACTIVE status)
 */
router.patch('/:id/unhide', adminMiddleware, async (req, res) => {
   try {
      const trip = await Trip.findById(req.params.id);

      if (!trip) {
         return res.status(404).json({
            success: false,
            message: 'Trip not found'
         });
      }

      // Check if trip dates are still valid
      const now = new Date();
      if (trip.startDate <= now) {
         trip.status = 'COMPLETED';
      } else {
         trip.status = 'ACTIVE';
      }

      await trip.save();

      res.json({
         success: true,
         message: 'Trip restored successfully',
         trip: {
            _id: trip._id,
            title: trip.title,
            status: trip.status,
            createdBy: trip.createdBy
         }
      });
   } catch (error) {
      console.error('Admin unhide trip error:', error);
      res.status(500).json({
         success: false,
         message: 'Error restoring trip'
      });
   }
});

/**
 * DELETE /api/admin/trips/:id
 * Delete a trip permanently
 */
router.delete('/:id', adminMiddleware, async (req, res) => {
   try {
      const trip = await Trip.findById(req.params.id);

      if (!trip) {
         return res.status(404).json({
            success: false,
            message: 'Trip not found'
         });
      }

      await Trip.findByIdAndDelete(req.params.id);

      res.json({
         success: true,
         message: 'Trip deleted permanently'
      });
   } catch (error) {
      console.error('Admin delete trip error:', error);
      res.status(500).json({
         success: false,
         message: 'Error deleting trip'
      });
   }
});

/**
 * GET /api/admin/trips/stats
 * Get trip statistics
 */
router.get('/stats/overview', adminMiddleware, async (req, res) => {
   try {
      const stats = await Promise.all([
         Trip.countDocuments({ status: 'OPEN' }),
         Trip.countDocuments({ status: 'CLOSED' }),
         Trip.countDocuments({ status: 'COMPLETED' }),
         Trip.countDocuments({ status: 'CANCELLED' }),
         Trip.countDocuments({ status: 'HIDDEN' }),
         Trip.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }) // Last 30 days
      ]);

      res.json({
         success: true,
         stats: {
            openTrips: stats[0],
            closedTrips: stats[1],
            completedTrips: stats[2],
            cancelledTrips: stats[3],
            hiddenTrips: stats[4],
            newTripsLast30Days: stats[5]
         }
      });
   } catch (error) {
      console.error('Admin trip stats error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching trip statistics'
      });
   }
});

module.exports = router;