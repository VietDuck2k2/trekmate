const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
   trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true
   },
   type: {
      type: String,
      enum: ['group', 'direct'],
      required: true,
      default: 'group'
   },
   sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   // For DMs: the specific recipient
   receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
   },
   content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
   },
   readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   }]
}, {
   timestamps: true
});

// Compound index for fast retrieval
messageSchema.index({ trip: 1, type: 1, createdAt: -1 });
messageSchema.index({ trip: 1, sender: 1, receiver: 1, type: 1 });

module.exports = mongoose.model('Message', messageSchema);
