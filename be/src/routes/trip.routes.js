const express = require('express');
const Trip = require('../models/trip.model');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * GET /api/trips
 * List all trips (public endpoint with optional filtering)
 */
router.get('/', optionalAuthMiddleware, async (req, res) => {
   try {
      const {
         search,
         location,
         difficulty,
         dateFrom,
         dateTo,
         status = 'ACTIVE',
         page = 1,
         limit = 10
      } = req.query;

      // Build filter object
      const filter = {};

      // Default to ACTIVE status for normal users
      filter.status = status;

      // Text search in title and description (case-insensitive)
      if (search && search.trim()) {
         filter.$or = [
            { title: new RegExp(search.trim(), 'i') },
            { description: new RegExp(search.trim(), 'i') }
         ];
      }

      // Location search (partial match, case-insensitive)
      if (location && location.trim()) {
         filter.location = new RegExp(location.trim(), 'i');
      }

      // Difficulty filter (exact match, case-insensitive)
      if (difficulty && difficulty.trim()) {
         filter.difficulty = new RegExp(`^${difficulty.trim()}$`, 'i');
      }

      // Date range filtering
      if (dateFrom || dateTo) {
         const dateFilter = {};

         if (dateFrom) {
            const fromDate = new Date(dateFrom);
            if (!isNaN(fromDate.getTime())) {
               // Trip ends on or after the specified from date
               dateFilter.$gte = fromDate;
            }
         }

         if (dateTo) {
            const toDate = new Date(dateTo);
            if (!isNaN(toDate.getTime())) {
               // Trip starts on or before the specified to date
               if (!filter.startDate) filter.startDate = {};
               filter.startDate.$lte = toDate;
            }
         }

         // For overlap: trip.startDate <= dateTo AND trip.endDate >= dateFrom
         if (dateFrom && dateTo) {
            const fromDate = new Date(dateFrom);
            const toDate = new Date(dateTo);

            if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
               filter.$and = [
                  { startDate: { $lte: toDate } },
                  {
                     $or: [
                        { endDate: { $gte: fromDate } },
                        { endDate: { $exists: false } } // Handle trips without end date
                     ]
                  }
               ];
            }
         } else if (dateFrom) {
            const fromDate = new Date(dateFrom);
            if (!isNaN(fromDate.getTime())) {
               filter.$or = [
                  { endDate: { $gte: fromDate } },
                  { endDate: { $exists: false } }
               ];
            }
         } else if (dateTo) {
            const toDate = new Date(dateTo);
            if (!isNaN(toDate.getTime())) {
               filter.startDate = { $lte: toDate };
            }
         }
      }

      const skip = (page - 1) * limit;

      const trips = await Trip.find(filter)
         .populate('createdBy', 'displayName avatarUrl')
         .populate('members', 'displayName avatarUrl')
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(parseInt(limit));

      const total = await Trip.countDocuments(filter);

      res.json({
         success: true,
         trips,
         total
      });
   } catch (error) {
      console.error('List trips error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching trips'
      });
   }
});

/**
 * GET /api/trips/my/joined
 * Get trips current user joined (requires authentication)
 */
router.get('/my/joined', authMiddleware, async (req, res) => {
   try {
      const trips = await Trip.find({ members: req.user._id })
         .populate('createdBy', 'displayName avatarUrl')
         .populate('members', 'displayName avatarUrl')
         .sort({ startDate: 1 });

      res.json({
         success: true,
         trips
      });
   } catch (error) {
      console.error('Get my trips error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching your trips'
      });
   }
});

/**
 * GET /api/trips/my/created
 * Get trips current user created (requires authentication)
 */
router.get('/my/created', authMiddleware, async (req, res) => {
   try {
      const trips = await Trip.find({ createdBy: req.user._id })
         .populate('createdBy', 'displayName avatarUrl')
         .populate('members', 'displayName avatarUrl')
         .sort({ createdAt: -1 });

      res.json({
         success: true,
         trips
      });
   } catch (error) {
      console.error('Get created trips error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching your created trips'
      });
   }
});

/**
 * GET /api/trips/:id
 * Get trip details (public endpoint)
 */
router.get('/:id', optionalAuthMiddleware, async (req, res) => {
   try {
      const trip = await Trip.findById(req.params.id)
         .populate('createdBy', 'displayName avatarUrl bio location')
         .populate('members', 'displayName avatarUrl');

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
      console.error('Get trip error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching trip details'
      });
   }
});

/**
 * POST /api/trips
 * Create a new trip (requires authentication)
 */
router.post('/', authMiddleware, async (req, res) => {
   try {
      const {
         title,
         description,
         location,
         startDate,
         endDate,
         difficulty,
         maxMembers,
         meetingPoint,
         requirements,
         costPerPerson
      } = req.body;

      console.log('Creating trip with data:', req.body);

      // Validate required fields
      if (!title || !location || !startDate) {
         return res.status(400).json({
            success: false,
            message: 'Title, location, and start date are required'
         });
      }

      // Validate start date is in future
      if (new Date(startDate) <= new Date()) {
         return res.status(400).json({
            success: false,
            message: 'Start date must be in the future'
         });
      }

      // Validate maxMembers is positive (if provided)
      if (maxMembers && maxMembers < 1) {
         return res.status(400).json({
            success: false,
            message: 'Max members must be at least 1'
         });
      }

      // Create trip with creator as first member
      const tripData = {
         title,
         description,
         location,
         startDate,
         endDate,
         difficulty,
         createdBy: req.user._id,
         members: [req.user._id], // Creator automatically joins
         status: 'ACTIVE'
      };

      // Add optional fields if provided
      if (maxMembers) tripData.maxMembers = maxMembers;
      if (meetingPoint) tripData.meetingPoint = meetingPoint;
      if (requirements) tripData.requirements = requirements;
      if (costPerPerson) tripData.costPerPerson = costPerPerson;

      const trip = new Trip(tripData);
      await trip.save();

      // Populate creator info for response
      await trip.populate('createdBy', 'displayName avatarUrl');
      await trip.populate('members', 'displayName avatarUrl');

      console.log('Trip created successfully:', trip._id);

      res.status(201).json({
         success: true,
         message: 'Trip created successfully',
         trip
      });
   } catch (error) {
      console.error('Create trip error:', error);
      res.status(500).json({
         success: false,
         message: 'Error creating trip'
      });
   }
});

/**
 * POST /api/trips/:id/join
 * Join a trip (requires authentication)
 */
router.post('/:id/join', authMiddleware, async (req, res) => {
   try {
      const trip = await Trip.findById(req.params.id);

      if (!trip) {
         return res.status(404).json({
            success: false,
            message: 'Trip not found'
         });
      }

      // Check if trip is still open for joining
      if (trip.status !== 'ACTIVE') {
         return res.status(400).json({
            success: false,
            message: 'Trip is not open for joining'
         });
      }

      // Check if trip hasn't started yet
      if (new Date(trip.startDate) <= new Date()) {
         return res.status(400).json({
            success: false,
            message: 'Cannot join trip that has already started'
         });
      }

      // Check if user already joined
      if (trip.members.includes(req.user._id)) {
         return res.status(400).json({
            success: false,
            message: 'You have already joined this trip'
         });
      }

      // Check if trip is full
      if (trip.members.length >= trip.maxMembers) {
         return res.status(400).json({
            success: false,
            message: 'Trip is full'
         });
      }

      // Add user to members
      trip.members.push(req.user._id);
      await trip.save();

      await trip.populate('members', 'displayName avatarUrl');

      res.json({
         success: true,
         message: 'Successfully joined the trip',
         trip
      });
   } catch (error) {
      console.error('Join trip error:', error);
      res.status(500).json({
         success: false,
         message: 'Error joining trip'
      });
   }
});

/**
 * POST /api/trips/:id/leave
 * Leave a trip (requires authentication)
 */
router.post('/:id/leave', authMiddleware, async (req, res) => {
   try {
      const trip = await Trip.findById(req.params.id);

      if (!trip) {
         return res.status(404).json({
            success: false,
            message: 'Trip not found'
         });
      }

      // Check if user is a member
      if (!trip.members.includes(req.user._id)) {
         return res.status(400).json({
            success: false,
            message: 'You are not a member of this trip'
         });
      }

      // Check if trip hasn't started yet
      if (new Date(trip.startDate) <= new Date()) {
         return res.status(400).json({
            success: false,
            message: 'Cannot leave trip that has already started'
         });
      }

      // Trip creator cannot leave their own trip
      if (trip.createdBy.toString() === req.user._id.toString()) {
         return res.status(400).json({
            success: false,
            message: 'Trip creator cannot leave their own trip'
         });
      }

      // Remove user from members
      trip.members = trip.members.filter(memberId => !memberId.equals(req.user._id));
      await trip.save();

      await trip.populate('members', 'displayName avatarUrl');

      res.json({
         success: true,
         message: 'Successfully left the trip',
         trip
      });
   } catch (error) {
      console.error('Leave trip error:', error);
      res.status(500).json({
         success: false,
         message: 'Error leaving trip'
      });
   }
});

module.exports = router;