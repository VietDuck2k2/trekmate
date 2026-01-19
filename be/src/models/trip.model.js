const mongoose = require('mongoose');

/**
 * Trip schema for trekking trips
 */
const tripSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   description: {
      type: String
   },
   location: {
      type: String,
      required: true
   },
   startDate: {
      type: Date,
      required: true
   },
   endDate: {
      type: Date
   },
   difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'hard', 'extreme'],
      default: 'moderate'
   },
   maxMembers: {
      type: Number
   },
   meetingPoint: {
      type: String
   },
   requirements: {
      type: String
   },
   costPerPerson: {
      type: Number
   },
   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   }],
   joinRequests: [{
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
      },
      status: {
         type: String,
         enum: ['PENDING', 'APPROVED', 'REJECTED'],
         default: 'PENDING'
      },
      message: {
         type: String,
         maxlength: 500
      },
      createdAt: {
         type: Date,
         default: Date.now
      }
   }],
   status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'CANCELLED', 'COMPLETED', 'HIDDEN'],
      default: 'ACTIVE'
   }
}, {
   timestamps: true
});

module.exports = mongoose.model('Trip', tripSchema);