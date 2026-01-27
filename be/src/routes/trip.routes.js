const express = require('express');
const Trip = require('../models/trip.model');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth.middleware');
const NotificationService = require('../services/notificationService');

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
 * GET /api/trips/:id/review-eligibility
 * Check if a trip is eligible for review by the current user
 */
router.get('/:id/review-eligibility', optionalAuthMiddleware, async (req, res) => {
   try {
      const trip = await Trip.findById(req.params.id);

      if (!trip) {
         return res.status(404).json({
            success: false,
            message: 'Trip not found'
         });
      }

      const now = new Date();
      const isPast = trip.endDate && trip.endDate < now;

      // Determine eligibility
      // Note: Current logic in review.routes requires user to be a member
      const isMember = req.user && (trip.members.includes(req.user._id) || trip.createdBy.equals(req.user._id));

      res.json({
         success: true,
         isReviewable: isPast && isMember,
         reason: !isPast ? 'Trip has not ended yet' : (!isMember ? 'User is not a member of this trip' : null),
         trip: {
            title: trip.title,
            endDate: trip.endDate
         }
      });
   } catch (error) {
      console.error('Check review eligibility error:', error);
      res.status(500).json({
         success: false,
         message: 'Error checking review eligibility'
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
         .populate('members', 'displayName avatarUrl')
         .populate('joinRequests.user', 'displayName avatarUrl');

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
 * PUT /api/trips/:id
 * Update a trip (requires authentication - only trip organizer)
 */
router.put('/:id', authMiddleware, async (req, res) => {
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
         costPerPerson,
         coverImageUrl,
         photos,
         locationCoords,
         meetingPointCoords
      } = req.body;

      const trip = await Trip.findById(req.params.id);

      if (!trip) {
         return res.status(404).json({
            success: false,
            message: 'Trip not found'
         });
      }

      // Check if current user is the trip organizer
      if (trip.createdBy.toString() !== req.user._id.toString()) {
         return res.status(403).json({
            success: false,
            message: 'Only the trip organizer can update this trip'
         });
      }

      // Validate required fields
      if (!title || !location || !startDate) {
         return res.status(400).json({
            success: false,
            message: 'Title, location, and start date are required'
         });
      }

      // Validate start date is in future for new trips or if being changed
      if (new Date(startDate) <= new Date() && startDate !== trip.startDate.toISOString()) {
         return res.status(400).json({
            success: false,
            message: 'Start date must be in the future'
         });
      }

      // Update trip fields
      trip.title = title;
      trip.description = description;
      trip.location = location;
      trip.startDate = startDate;
      trip.endDate = endDate;
      trip.difficulty = difficulty;
      trip.maxMembers = maxMembers || trip.maxMembers;
      trip.meetingPoint = meetingPoint || trip.meetingPoint;
      trip.requirements = requirements || trip.requirements;
      trip.costPerPerson = costPerPerson || trip.costPerPerson;
      if (coverImageUrl !== undefined) {
         trip.coverImageUrl = coverImageUrl;
      }
      if (photos !== undefined && Array.isArray(photos)) {
         // Filter out empty or whitespace-only URLs
         trip.photos = photos.filter(url => url && url.trim().length > 0);
      }
      if (locationCoords) trip.locationCoords = locationCoords;
      if (meetingPointCoords) trip.meetingPointCoords = meetingPointCoords;

      await trip.save();

      await trip.populate('createdBy', 'displayName avatarUrl');
      await trip.populate('members', 'displayName avatarUrl');

      res.json({
         success: true,
         message: 'Trip updated successfully',
         trip
      });
   } catch (error) {
      console.error('Update trip error:', error);
      res.status(500).json({
         success: false,
         message: 'Error updating trip'
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
         costPerPerson,
         coverImageUrl,
         photos,
         locationCoords,
         meetingPointCoords
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
      if (coverImageUrl) tripData.coverImageUrl = coverImageUrl;
      if (photos && Array.isArray(photos)) {
         // Filter out empty or whitespace-only URLs
         tripData.photos = photos.filter(url => url && url.trim().length > 0);
      }
      if (locationCoords) tripData.locationCoords = locationCoords;
      if (meetingPointCoords) tripData.meetingPointCoords = meetingPointCoords;

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
 * POST /api/trips/:id/request-join
 * Request to join a trip (requires authentication)
 */
router.post('/:id/request-join', authMiddleware, async (req, res) => {
   try {
      const { message } = req.body;
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

      // Check if user is already a member
      if (trip.members.includes(req.user._id)) {
         return res.status(400).json({
            success: false,
            message: 'You are already a member of this trip'
         });
      }

      // Check if user already has a pending request
      const existingRequest = trip.joinRequests.find(
         request => request.user.toString() === req.user._id.toString() && request.status === 'PENDING'
      );

      if (existingRequest) {
         return res.status(400).json({
            success: false,
            message: 'You already have a pending join request for this trip'
         });
      }

      // Check if trip would be full (including pending requests)
      if (trip.maxMembers && trip.members.length >= trip.maxMembers) {
         return res.status(400).json({
            success: false,
            message: 'Trip is full'
         });
      }

      // Create join request
      trip.joinRequests.push({
         user: req.user._id,
         message: message?.trim(),
         status: 'PENDING'
      });

      await trip.save();

      // Create notifications for organizer and members
      await NotificationService.createJoinRequestNotifications(trip, req.user);

      res.json({
         success: true,
         message: 'Join request submitted successfully. Waiting for organizer approval.'
      });
   } catch (error) {
      console.error('Request join trip error:', error);
      res.status(500).json({
         success: false,
         message: 'Error submitting join request'
      });
   }
});

/**
 * POST /api/trips/:id/approve-request/:requestUserId
 * Approve a join request (requires authentication - only trip organizer)
 */
router.post('/:id/approve-request/:requestUserId', authMiddleware, async (req, res) => {
   try {
      const trip = await Trip.findById(req.params.id);
      const { requestUserId } = req.params;

      if (!trip) {
         return res.status(404).json({
            success: false,
            message: 'Trip not found'
         });
      }

      // Check if current user is the trip organizer
      if (trip.createdBy.toString() !== req.user._id.toString()) {
         return res.status(403).json({
            success: false,
            message: 'Only the trip organizer can approve join requests'
         });
      }

      // Find the join request
      const requestIndex = trip.joinRequests.findIndex(
         request => request.user.toString() === requestUserId && request.status === 'PENDING'
      );

      if (requestIndex === -1) {
         return res.status(404).json({
            success: false,
            message: 'Join request not found or already processed'
         });
      }

      // Check if trip is full
      if (trip.maxMembers && trip.members.length >= trip.maxMembers) {
         return res.status(400).json({
            success: false,
            message: 'Cannot approve request - trip is full'
         });
      }

      // Check if user is already a member (edge case)
      if (trip.members.includes(requestUserId)) {
         // Remove the request and return success
         trip.joinRequests.splice(requestIndex, 1);
         await trip.save();
         return res.json({
            success: true,
            message: 'User is already a member of this trip'
         });
      }

      // Store existing member IDs before adding the new member
      const existingMemberIds = [...trip.members];

      // Add user to members and remove the request
      trip.members.push(requestUserId);
      const approvedRequest = trip.joinRequests[requestIndex];
      trip.joinRequests.splice(requestIndex, 1);

      await trip.save();

      // Populate the newly added member to get their details
      const newMember = await require('../models/user.model').findById(requestUserId).select('displayName');

      // Create approval notification for the requester
      await NotificationService.createJoinRequestApprovedNotification(trip, { _id: requestUserId }, req.user);

      // Create member joined notifications for all existing members
      await NotificationService.createMemberJoinedNotifications(trip, newMember, existingMemberIds);

      await trip.populate(['members', 'joinRequests.user'], 'displayName avatarUrl');

      res.json({
         success: true,
         message: 'Join request approved successfully',
         trip
      });
   } catch (error) {
      console.error('Approve join request error:', error);
      res.status(500).json({
         success: false,
         message: 'Error approving join request'
      });
   }
});

/**
 * POST /api/trips/:id/reject-request/:requestUserId
 * Reject a join request (requires authentication - only trip organizer)
 */
router.post('/:id/reject-request/:requestUserId', authMiddleware, async (req, res) => {
   try {
      const trip = await Trip.findById(req.params.id);
      const { requestUserId } = req.params;

      if (!trip) {
         return res.status(404).json({
            success: false,
            message: 'Trip not found'
         });
      }

      // Check if current user is the trip organizer
      if (trip.createdBy.toString() !== req.user._id.toString()) {
         return res.status(403).json({
            success: false,
            message: 'Only the trip organizer can reject join requests'
         });
      }

      // Find and remove the join request
      const requestIndex = trip.joinRequests.findIndex(
         request => request.user.toString() === requestUserId && request.status === 'PENDING'
      );

      if (requestIndex === -1) {
         return res.status(404).json({
            success: false,
            message: 'Join request not found or already processed'
         });
      }

      // Remove the request
      const rejectedRequest = trip.joinRequests[requestIndex];
      trip.joinRequests.splice(requestIndex, 1);

      await trip.save();

      // Create rejection notification for the requester
      const requester = { _id: requestUserId };
      await NotificationService.createJoinRequestRejectedNotification(trip, requester, req.user);

      await trip.populate(['members', 'joinRequests.user'], 'displayName avatarUrl');

      res.json({
         success: true,
         message: 'Join request rejected',
         trip
      });
   } catch (error) {
      console.error('Reject join request error:', error);
      res.status(500).json({
         success: false,
         message: 'Error rejecting join request'
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