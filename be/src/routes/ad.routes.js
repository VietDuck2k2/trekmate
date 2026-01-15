const express = require('express');
const Ad = require('../models/ad.model');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * GET /api/ads
 * List all active ads (public endpoint)
 */
router.get('/', optionalAuthMiddleware, async (req, res) => {
   try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      // Only show active ads to public
      const filter = { status: 'ACTIVE' };

      const ads = await Ad.find(filter)
         .populate('brandId', 'displayName brandInfo.brandName brandInfo.logoUrl brandInfo.website')
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(parseInt(limit));

      const total = await Ad.countDocuments(filter);

      res.json({
         success: true,
         ads,
         pagination: {
            current: parseInt(page),
            total: Math.ceil(total / limit),
            count: ads.length,
            totalAds: total
         }
      });
   } catch (error) {
      console.error('List ads error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching ads'
      });
   }
});

/**
 * GET /api/ads/:id
 * Get ad details (public endpoint)
 */
router.get('/:id', optionalAuthMiddleware, async (req, res) => {
   try {
      const ad = await Ad.findById(req.params.id)
         .populate('brandId', 'displayName brandInfo.brandName brandInfo.logoUrl brandInfo.website brandInfo.description');

      if (!ad) {
         return res.status(404).json({
            success: false,
            message: 'Ad not found'
         });
      }

      // Only show active ads to public (unless it's the brand owner)
      if (ad.status !== 'ACTIVE' && (!req.user || ad.brandId._id.toString() !== req.user._id.toString())) {
         return res.status(404).json({
            success: false,
            message: 'Ad not found'
         });
      }

      res.json({
         success: true,
         ad
      });
   } catch (error) {
      console.error('Get ad error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching ad details'
      });
   }
});

/**
 * POST /api/ads
 * Create a new ad (requires BRAND authentication)
 */
router.post('/', authMiddleware, async (req, res) => {
   try {
      // Only BRAND users can create ads
      if (req.user.role !== 'BRAND') {
         return res.status(403).json({
            success: false,
            message: 'Only brands can create ads'
         });
      }

      const { title, description, imageUrl, linkUrl } = req.body;

      // Validate required fields
      if (!title) {
         return res.status(400).json({
            success: false,
            message: 'Title is required'
         });
      }

      // Create ad
      const ad = new Ad({
         title,
         description,
         imageUrl,
         linkUrl,
         brandId: req.user._id
      });

      await ad.save();

      // Populate brand info for response
      await ad.populate('brandId', 'displayName brandInfo.brandName brandInfo.logoUrl brandInfo.website');

      res.status(201).json({
         success: true,
         message: 'Ad created successfully',
         ad
      });
   } catch (error) {
      console.error('Create ad error:', error);
      res.status(500).json({
         success: false,
         message: 'Error creating ad'
      });
   }
});

/**
 * PUT /api/ads/:id
 * Update an ad (requires brand ownership or admin)
 */
router.put('/:id', authMiddleware, async (req, res) => {
   try {
      const ad = await Ad.findById(req.params.id);

      if (!ad) {
         return res.status(404).json({
            success: false,
            message: 'Ad not found'
         });
      }

      // Check ownership (brand owner or admin)
      if (ad.brandId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
         return res.status(403).json({
            success: false,
            message: 'You can only edit your own ads'
         });
      }

      const { title, description, imageUrl, linkUrl, status } = req.body;

      // Update fields
      if (title !== undefined) ad.title = title;
      if (description !== undefined) ad.description = description;
      if (imageUrl !== undefined) ad.imageUrl = imageUrl;
      if (linkUrl !== undefined) ad.linkUrl = linkUrl;

      // Only admin can change status
      if (status !== undefined) {
         if (req.user.role === 'ADMIN') {
            ad.status = status;
         } else if (req.user.role === 'BRAND') {
            // Brands can only activate/deactivate their own ads
            if (['ACTIVE', 'INACTIVE'].includes(status)) {
               ad.status = status;
            }
         }
      }

      await ad.save();
      await ad.populate('brandId', 'displayName brandInfo.brandName brandInfo.logoUrl brandInfo.website');

      res.json({
         success: true,
         message: 'Ad updated successfully',
         ad
      });
   } catch (error) {
      console.error('Update ad error:', error);
      res.status(500).json({
         success: false,
         message: 'Error updating ad'
      });
   }
});

/**
 * DELETE /api/ads/:id
 * Delete an ad (requires brand ownership or admin)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
   try {
      const ad = await Ad.findById(req.params.id);

      if (!ad) {
         return res.status(404).json({
            success: false,
            message: 'Ad not found'
         });
      }

      // Check ownership (brand owner or admin)
      if (ad.brandId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
         return res.status(403).json({
            success: false,
            message: 'You can only delete your own ads'
         });
      }

      await Ad.findByIdAndDelete(req.params.id);

      res.json({
         success: true,
         message: 'Ad deleted successfully'
      });
   } catch (error) {
      console.error('Delete ad error:', error);
      res.status(500).json({
         success: false,
         message: 'Error deleting ad'
      });
   }
});

/**
 * GET /api/ads/my/list
 * Get ads created by current brand (requires BRAND authentication)
 */
router.get('/my/list', authMiddleware, async (req, res) => {
   try {
      // Only BRAND users can access this endpoint
      if (req.user.role !== 'BRAND') {
         return res.status(403).json({
            success: false,
            message: 'Only brands can access their ads'
         });
      }

      const { page = 1, limit = 10, status } = req.query;
      const skip = (page - 1) * limit;

      // Build filter
      const filter = { brandId: req.user._id };
      if (status) filter.status = status;

      const ads = await Ad.find(filter)
         .populate('brandId', 'displayName brandInfo.brandName brandInfo.logoUrl')
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(parseInt(limit));

      const total = await Ad.countDocuments(filter);

      res.json({
         success: true,
         ads,
         pagination: {
            current: parseInt(page),
            total: Math.ceil(total / limit),
            count: ads.length,
            totalAds: total
         }
      });
   } catch (error) {
      console.error('Get brand ads error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching your ads'
      });
   }
});

module.exports = router;