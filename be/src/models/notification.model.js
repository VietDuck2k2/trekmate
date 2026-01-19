const mongoose = require('mongoose');

/**
 * Notification schema for user notifications
 */
const notificationSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   type: {
      type: String,
      enum: [
         'JOIN_REQUEST_RECEIVED',
         'JOIN_REQUEST_APPROVED', 
         'JOIN_REQUEST_REJECTED',
         'MEMBER_JOINED'
      ],
      required: true
   },
   trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true
   },
   fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   message: {
      type: String,
      required: true
   },
   isRead: {
      type: Boolean,
      default: false
   }
}, {
   timestamps: true
});

// Index for efficient queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);