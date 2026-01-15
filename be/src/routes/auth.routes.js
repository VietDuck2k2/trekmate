const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user (USER or BRAND role)
 */
router.post('/register', async (req, res) => {
   try {
      const { email, password, role, displayName, brandInfo } = req.body;

      // Validate required fields
      if (!email || !password || !displayName) {
         return res.status(400).json({
            success: false,
            message: 'Email, password, and displayName are required'
         });
      }

      // Only allow USER and BRAND roles from public registration
      if (role && !['USER', 'BRAND'].includes(role)) {
         return res.status(400).json({
            success: false,
            message: 'Invalid role. Only USER and BRAND are allowed'
         });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({
            success: false,
            message: 'User with this email already exists'
         });
      }

      // Validate brandInfo for BRAND role
      if (role === 'BRAND') {
         if (!brandInfo || !brandInfo.brandName) {
            return res.status(400).json({
               success: false,
               message: 'Brand name is required for BRAND registration'
            });
         }
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const userData = {
         email,
         passwordHash,
         role: role || 'USER',
         displayName
      };

      // Add brandInfo if BRAND role
      if (role === 'BRAND' && brandInfo) {
         userData.brandInfo = brandInfo;
      }

      const user = new User(userData);
      await user.save();

      // Generate JWT token
      const token = generateToken(user._id);

      // Return user data (without password hash)
      const userResponse = {
         _id: user._id,
         email: user.email,
         role: user.role,
         displayName: user.displayName,
         avatarUrl: user.avatarUrl,
         bio: user.bio,
         location: user.location,
         brandInfo: user.brandInfo,
         createdAt: user.createdAt
      };

      res.status(201).json({
         success: true,
         message: 'User registered successfully',
         user: userResponse,
         token
      });

   } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
         success: false,
         message: 'Server error during registration'
      });
   }
});

/**
 * POST /api/auth/login
 * Login existing user
 */
router.post('/login', async (req, res) => {
   try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: 'Email and password are required'
         });
      }

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
         });
      }

      // Check if user account is blocked
      if (user.status === 'BLOCKED') {
         return res.status(403).json({
            success: false,
            message: 'Account is blocked. Please contact support.'
         });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
         return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
         });
      }

      // Generate JWT token
      const token = generateToken(user._id);

      // Return user data (without password hash)
      const userResponse = {
         _id: user._id,
         email: user.email,
         role: user.role,
         displayName: user.displayName,
         avatarUrl: user.avatarUrl,
         bio: user.bio,
         location: user.location,
         brandInfo: user.brandInfo,
         createdAt: user.createdAt
      };

      res.json({
         success: true,
         message: 'Login successful',
         user: userResponse,
         token
      });

   } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
         success: false,
         message: 'Server error during login'
      });
   }
});

module.exports = router;