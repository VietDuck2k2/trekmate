const express = require('express');
const router = express.Router();
const Message = require('../models/message.model');
const Trip = require('../models/trip.model');
const { authMiddleware } = require('../middleware/auth.middleware');

// Helper: check if user is a member of the trip
const isTripMember = async (tripId, userId) => {
   const trip = await Trip.findById(tripId);
   if (!trip) return false;
   return (
      trip.createdBy.toString() === userId.toString() ||
      trip.members.some(m => m.toString() === userId.toString())
   );
};

/**
 * GET /api/trips/:id/chat/messages/group
 * Get group chat message history
 */
router.get('/:id/chat/messages/group', authMiddleware, async (req, res) => {
   try {
      const allowed = await isTripMember(req.params.id, req.user._id);
      if (!allowed) return res.status(403).json({ success: false, message: 'Access denied' });

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const skip = (page - 1) * limit;

      const messages = await Message.find({ trip: req.params.id, type: 'group' })
         .populate('sender', 'displayName avatarUrl')
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit)
         .lean();

      res.json({ success: true, messages: messages.reverse(), page });
   } catch (error) {
      console.error('Get group messages error:', error);
      res.status(500).json({ success: false, message: 'Error fetching messages' });
   }
});

/**
 * GET /api/trips/:id/chat/messages/direct/:userId
 * Get DM history between current user and another member
 */
router.get('/:id/chat/messages/direct/:userId', authMiddleware, async (req, res) => {
   try {
      const allowed = await isTripMember(req.params.id, req.user._id);
      const otherAllowed = await isTripMember(req.params.id, req.params.userId);
      if (!allowed || !otherAllowed) return res.status(403).json({ success: false, message: 'Access denied' });

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const skip = (page - 1) * limit;

      const messages = await Message.find({
         trip: req.params.id,
         type: 'direct',
         $or: [
            { sender: req.user._id, receiver: req.params.userId },
            { sender: req.params.userId, receiver: req.user._id }
         ]
      })
         .populate('sender', 'displayName avatarUrl')
         .populate('receiver', 'displayName avatarUrl')
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit)
         .lean();

      res.json({ success: true, messages: messages.reverse(), page });
   } catch (error) {
      console.error('Get DM messages error:', error);
      res.status(500).json({ success: false, message: 'Error fetching messages' });
   }
});

/**
 * GET /api/trips/:id/chat/conversations
 * Get list of members who have DM-ed the current user in this trip
 */
router.get('/:id/chat/conversations', authMiddleware, async (req, res) => {
   try {
      const allowed = await isTripMember(req.params.id, req.user._id);
      if (!allowed) return res.status(403).json({ success: false, message: 'Access denied' });

      // Find distinct people who have exchanged DMs with the user in this trip
      const dms = await Message.find({
         trip: req.params.id,
         type: 'direct',
         $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
         ]
      })
         .populate('sender', 'displayName avatarUrl')
         .populate('receiver', 'displayName avatarUrl')
         .sort({ createdAt: -1 })
         .lean();

      // Deduplicate by partner user
      const seenUsers = new Set();
      const conversations = [];
      for (const msg of dms) {
         const partner = msg.sender._id.toString() === req.user._id.toString() ? msg.receiver : msg.sender;
         if (!seenUsers.has(partner._id.toString())) {
            seenUsers.add(partner._id.toString());
            conversations.push({ partner, lastMessage: msg });
         }
      }

      res.json({ success: true, conversations });
   } catch (error) {
      console.error('Get conversations error:', error);
      res.status(500).json({ success: false, message: 'Error fetching conversations' });
   }
});

module.exports = router;
