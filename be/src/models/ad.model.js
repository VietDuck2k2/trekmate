const mongoose = require('mongoose');

/**
 * Ad schema for brand advertising posts
 */
const adSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   description: {
      type: String
   },
   imageUrl: {
      type: String
   },
   linkUrl: {
      type: String
   },
   brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'HIDDEN'],
      default: 'PENDING'
   }
}, {
   timestamps: true
});

module.exports = mongoose.model('Ad', adSchema);