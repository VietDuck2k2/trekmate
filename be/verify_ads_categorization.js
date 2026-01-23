
const API_URL = 'http://localhost:5000/api';

async function verifyAdsCategorization() {
   console.log('Starting Ad Categorization Verification...');

   let token;
   let createdAds = [];

   // 1. Register a Brand User
   try {
      const timestamp = Date.now();
      const registerRes = await fetch(`${API_URL}/auth/register`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            email: `brand_test_${timestamp}@example.com`,
            password: 'password123',
            displayName: 'Test Brand',
            role: 'BRAND',
            brandInfo: { brandName: 'Test Brand Inc.' }
         })
      });

      const registerData = await registerRes.json();
      if (!registerData.success) {
         throw new Error(`Registration failed: ${registerData.message}`);
      }
      token = registerData.token;
      console.log('✅ Registered Test Brand User');
   } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      return;
   }

   // 2. Create and Activate Ads with different categories
   const categories = ['STAY', 'EAT', 'PLAY'];

   try {
      for (const cat of categories) {
         // Create
         const res = await fetch(`${API_URL}/ads`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
               title: `Test Ad for ${cat}`,
               description: `This is a test advertisement for category ${cat}`,
               imageUrl: 'https://placehold.co/600x400',
               linkUrl: 'https://example.com',
               category: cat
            })
         });
         const data = await res.json();
         if (!data.success) {
            throw new Error(`Failed to create ad for ${cat}: ${data.message}`);
         }

         const adId = data.ad._id;
         createdAds.push(data.ad);
         console.log(`✅ Created Ad for category: ${cat}`);

         // Activate
         const activateRes = await fetch(`${API_URL}/ads/${adId}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'ACTIVE' })
         });

         const activateData = await activateRes.json();
         if (!activateData.success) {
            console.error(`❌ Failed to activate ad ${adId}: ${activateData.message}`);
         } else {
            console.log(`✅ Activated Ad for category: ${cat}`);
         }
      }
   } catch (error) {
      console.error('❌ Ad creation/activation failed:', error.message);
      return;
   }

   // 3. Verify Filtering
   try {
      // Test STAY
      const stayRes = await fetch(`${API_URL}/ads?category=STAY`);
      const stayData = await stayRes.json();
      const stayAds = stayData.ads || [];
      const hasStay = stayAds.some(ad => ad.title === `Test Ad for STAY`);
      const hasEat = stayAds.some(ad => ad.title === `Test Ad for EAT`);

      if (hasStay && !hasEat) {
         console.log('✅ Filter by STAY working correctly');
      } else {
         console.error('❌ Filter by STAY failed', { hasStay, hasEat });
         console.log('Returned Ads for STAY:', stayAds.map(a => ({ id: a._id, title: a.title, category: a.category })));
      }

      // Test EAT
      const eatRes = await fetch(`${API_URL}/ads?category=EAT`);
      const eatData = await eatRes.json();
      const eatAds = eatData.ads || [];
      const hasEatCorrect = eatAds.some(ad => ad.title === `Test Ad for EAT`);
      const hasPlay = eatAds.some(ad => ad.title === `Test Ad for PLAY`);

      if (hasEatCorrect && !hasPlay) {
         console.log('✅ Filter by EAT working correctly');
      } else {
         console.error('❌ Filter by EAT failed', { hasEatCorrect, hasPlay });
         console.log('Returned Ads for EAT:', eatAds.map(a => ({ id: a._id, title: a.title, category: a.category })));
      }

      // Test Search + Category
      const searchRes = await fetch(`${API_URL}/ads?category=PLAY&search=Test`);
      const searchData = await searchRes.json();
      const searchAds = searchData.ads || [];
      const validSearch = searchAds.every(ad => ad.category === 'PLAY' && ad.title.includes('Test'));
      const hasPlaySearch = searchAds.some(ad => ad.title === `Test Ad for PLAY`);

      if (validSearch && hasPlaySearch) {
         console.log('✅ Search + Category Filter working correctly');
      } else {
         console.error('❌ Search + Category Filter failed');
         console.log('Returned Ads for Search:', searchAds.map(a => ({ id: a._id, title: a.title, category: a.category })));
      }

   } catch (error) {
      console.error('❌ Verification failed:', error);
   }

   console.log('Verification Complete.');
}

verifyAdsCategorization();
