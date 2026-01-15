const express = require('express');
const Ad = require('../../models/ad.model');
const { adminMiddleware } = require('../../middleware/admin.middleware');

const router = express.Router();

/**
 * GET /api/admin/ads
 * List all ads (including pending and hidden ones)
 */
router.get('/', adminMiddleware, async (req, res) => {
   try {
      const { status, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      // Build filter object
      const filter = {};
      if (status) filter.status = status;

      const ads = await Ad.find(filter)
         .populate('brandId', 'displayName email brandInfo.brandName brandInfo.website status')
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
      console.error('Admin list ads error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching ads'
      });
   }
});

/**
 * GET /api/admin/ads/:id
 * Get detailed ad information
 */
router.get('/:id', adminMiddleware, async (req, res) => {
   try {
      const ad = await Ad.findById(req.params.id)
         .populate('brandId', 'displayName email brandInfo.brandName brandInfo.website brandInfo.description status');

      if (!ad) {
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
      console.error('Admin get ad error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching ad details'
      });
   }
});

/**
 * PATCH /api/admin/ads/:id/approve
 * Approve an ad (set status to ACTIVE)
 */
router.patch('/:id/approve', adminMiddleware, async (req, res) => {
   try {
      const ad = await Ad.findById(req.params.id);

      if (!ad) {
         return res.status(404).json({
            success: false,
            message: 'Ad not found'
         });
      }

      ad.status = 'ACTIVE';
      await ad.save();

      await ad.populate('brandId', 'displayName brandInfo.brandName');

      res.json({
         success: true,
         message: 'Ad approved successfully',
         ad: {
            _id: ad._id,
            title: ad.title,
            status: ad.status,
            brandId: ad.brandId
         }
      });
   } catch (error) {
      console.error('Admin approve ad error:', error);
      res.status(500).json({
         success: false,
         message: 'Error approving ad'
      });
   }
});

/**
 * PATCH /api/admin/ads/:id/hide
 * Hide an ad (set status to HIDDEN)
 */
router.patch('/:id/hide', adminMiddleware, async (req, res) => {
   try {
      const ad = await Ad.findById(req.params.id);

      if (!ad) {
         return res.status(404).json({
            success: false,
            message: 'Ad not found'
         });
      }

      ad.status = 'HIDDEN';
      await ad.save();

      res.json({
         success: true,
         message: 'Ad hidden successfully',
         ad: {
            _id: ad._id,
            title: ad.title,
            status: ad.status,
            brandId: ad.brandId
         }
      });
   } catch (error) {
      console.error('Admin hide ad error:', error);
      res.status(500).json({
         success: false,
         message: 'Error hiding ad'
      });
   }
});

/**
 * PATCH /api/admin/ads/:id/reject
 * Reject an ad (set status to INACTIVE)
 */
router.patch('/:id/reject', adminMiddleware, async (req, res) => {
   try {
      const ad = await Ad.findById(req.params.id);

      if (!ad) {
         return res.status(404).json({
            success: false,
            message: 'Ad not found'
         });
      }

      ad.status = 'INACTIVE';
      await ad.save();

      res.json({
         success: true,
         message: 'Ad rejected successfully',
         ad: {
            _id: ad._id,
            title: ad.title,
            status: ad.status,
            brandId: ad.brandId
         }
      });
   } catch (error) {
      console.error('Admin reject ad error:', error);
      res.status(500).json({
         success: false,
         message: 'Error rejecting ad'
      });
   }
});

/**
 * DELETE /api/admin/ads/:id
 * Delete an ad permanently
 */
router.delete('/:id', adminMiddleware, async (req, res) => {
   try {
      const ad = await Ad.findById(req.params.id);

      if (!ad) {
         return res.status(404).json({
            success: false,
            message: 'Ad not found'
         });
      }

      await Ad.findByIdAndDelete(req.params.id);

      res.json({
         success: true,
         message: 'Ad deleted permanently'
      });
   } catch (error) {
      console.error('Admin delete ad error:', error);
      res.status(500).json({
         success: false,
         message: 'Error deleting ad'
      });
   }
});

/**
 * GET /api/admin/ads/stats
 * Get ad statistics
 */
router.get('/stats/overview', adminMiddleware, async (req, res) => {
   try {
      const stats = await Promise.all([
         Ad.countDocuments({ status: 'PENDING' }),
         Ad.countDocuments({ status: 'ACTIVE' }),
         Ad.countDocuments({ status: 'INACTIVE' }),
         Ad.countDocuments({ status: 'HIDDEN' }),
         Ad.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }) // Last 30 days
      ]);

      res.json({
         success: true,
         stats: {
            pendingAds: stats[0],
            activeAds: stats[1],
            inactiveAds: stats[2],
            hiddenAds: stats[3],
            newAdsLast30Days: stats[4]
         }
      });
   } catch (error) {
      console.error('Admin ad stats error:', error);
      res.status(500).json({
         success: false,
         message: 'Error fetching ad statistics'
      });
   }
});

module.exports = router;