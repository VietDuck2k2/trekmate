const mongoose = require('mongoose');

/**
 * Review schema for trip reviews and ratings
 */
const reviewSchema = new mongoose.Schema({
   trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true
   },
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
   },
   comment: {
      type: String,
      maxlength: 500
   }
}, {
   timestamps: true
});

// Ensure one review per user per trip
reviewSchema.index({ trip: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);