const mongoose = require('mongoose');

/**
 * Brand info subdocument - only used when user role is 'BRAND'
 */
const brandInfoSchema = new mongoose.Schema({
   brandName: {
      type: String,
      required: true
   },
   logoUrl: {
      type: String
   },
   website: {
      type: String
   },
   description: {
      type: String
   }
}, { _id: false });

/**
 * User schema for all user types (USER, BRAND, ADMIN)
 */
const userSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
   },
   googleId: {
      type: String,
      unique: true,
      sparse: true // Allows null/missing for non-google users
   },
   passwordHash: {
      type: String,
      required: function () {
         return !this.googleId; // Only required if not OAuth
      }
   },
   role: {
      type: String,
      enum: ['USER', 'BRAND', 'ADMIN'],
      default: 'USER'
   },
   displayName: {
      type: String,
      required: true
   },
   avatarUrl: {
      type: String
   },
   bio: {
      type: String
   },
   location: {
      type: String
   },
   experienceLevel: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
      default: 'BEGINNER'
   },
   status: {
      type: String,
      enum: ['ACTIVE', 'BLOCKED'],
      default: 'ACTIVE'
   },
   resetPasswordToken: {
      type: String
   },
   resetPasswordExpires: {
      type: Date
   },
   brandInfo: {
      type: brandInfoSchema,
      required: function () {
         return this.role === 'BRAND';
      }
   }
}, {
   timestamps: true
});

module.exports = mongoose.model('User', userSchema);