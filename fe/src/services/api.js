// API base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API service for authentication
const authAPI = {
   // Register a new user
   register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.message || 'Registration failed');
      }

      return data;
   },

   // Login user
   login: async (credentials) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.message || 'Login failed');
      }

      return data;
   },
};

// API service for other endpoints (to be expanded later)
const tripsAPI = {
   // Get all trips
   getTrips: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${API_BASE_URL}/trips?${queryString}` : `${API_BASE_URL}/trips`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.message || 'Failed to fetch trips');
      }

      return data; // Return full response object that includes trips and total
   },

   // Get trip details
   getTripDetails: async (tripId) => {
      try {
         const url = `${API_BASE_URL}/trips/${tripId}`;
         console.log('=== getTripDetails API Debug ===');
         console.log('API_BASE_URL:', API_BASE_URL);
         console.log('tripId parameter:', tripId);
         console.log('Final URL being called:', url);

         if (!tripId) {
            throw new Error('Trip ID is required but was not provided');
         }

         const response = await fetch(url);
         console.log('Response status:', response.status);
         console.log('Response ok:', response.ok);

         const data = await response.json();
         console.log('Response data:', data);

         if (!response.ok) {
            console.error('getTripDetails error:', data);
            throw new Error(data.message || 'Failed to fetch trip details');
         }

         if (!data.trip) {
            console.error('No trip field in response:', data);
            throw new Error('Invalid response format - no trip data');
         }

         console.log('Returning trip:', data.trip);
         return data.trip;
      } catch (error) {
         console.error('getTripDetails fetch error:', error);
         throw error;
      }
   },

   // Create new trip
   createTrip: async (tripData) => {
      try {
         const response = await makeAuthenticatedRequest(`${API_BASE_URL}/trips`, {
            method: 'POST',
            body: JSON.stringify(tripData),
         });
         console.log('createTrip response:', response);
         return response;
      } catch (error) {
         console.error('createTrip error:', error);
         throw error;
      }
   },

   // Update existing trip
   updateTrip: async (tripId, tripData) => {
      try {
         const response = await makeAuthenticatedRequest(`${API_BASE_URL}/trips/${tripId}`, {
            method: 'PUT',
            body: JSON.stringify(tripData),
         });
         console.log('updateTrip response:', response);
         return response;
      } catch (error) {
         console.error('updateTrip error:', error);
         throw error;
      }
   },

   // Request to join a trip (new approval-based system)
   requestToJoin: async (tripId, message = '') => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/trips/${tripId}/request-join`, {
         method: 'POST',
         body: JSON.stringify({ message })
      });
   },

   // Approve a join request (organizer only)
   approveJoinRequest: async (tripId, requestUserId) => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/trips/${tripId}/approve-request/${requestUserId}`, {
         method: 'POST',
      });
   },

   // Reject a join request (organizer only)
   rejectJoinRequest: async (tripId, requestUserId) => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/trips/${tripId}/reject-request/${requestUserId}`, {
         method: 'POST',
      });
   },

   // Leave a trip
   leaveTrip: async (tripId) => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/trips/${tripId}/leave`, {
         method: 'POST',
      });
   },

   // Get user's joined trips
   getMyJoinedTrips: async () => {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/trips/my/joined`);
      return response.trips || [];
   },

   // Get user's created trips
   getMyCreatedTrips: async () => {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/trips/my/created`);
      return response.trips || [];
   },
};

// Helper function to make authenticated API calls
const makeAuthenticatedRequest = async (url, options = {}) => {
   const token = localStorage.getItem('token');

   const response = await fetch(url, {
      ...options,
      headers: {
         'Content-Type': 'application/json',
         ...(token && { Authorization: `Bearer ${token}` }),
         ...options.headers,
      },
   });

   const data = await response.json();

   if (!response.ok) {
      // Handle blocked user account (403 with specific message)
      if (response.status === 403 && data.message && data.message.includes('blocked')) {
         // Clear auth state from localStorage
         localStorage.removeItem('token');
         localStorage.removeItem('user');

         // Show alert to user
         alert('Your account has been blocked. Please contact support.');

         // Redirect to login page
         window.location.href = '/login';

         return; // Don't throw error since we're redirecting
      }

      throw new Error(data.message || 'Request failed');
   }

   return data;
};

// Admin API service
const adminAPI = {
   // Users management
   getUsers: async () => {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/admin/users`);
      return response.users || [];
   },

   blockUser: async (userId) => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/admin/users/${userId}/block`, {
         method: 'PATCH',
      });
   },

   unblockUser: async (userId) => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/admin/users/${userId}/unblock`, {
         method: 'PATCH',
      });
   },

   // Trips management
   getTrips: async () => {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/admin/trips`);
      return response.trips || [];
   },

   hideTrip: async (tripId) => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/admin/trips/${tripId}/hide`, {
         method: 'PATCH',
      });
   },

   unhideTrip: async (tripId) => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/admin/trips/${tripId}/unhide`, {
         method: 'PATCH',
      });
   },

   deleteTrip: async (tripId) => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/admin/trips/${tripId}`, {
         method: 'DELETE',
      });
   },

   // Ads management
   getAds: async () => {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/admin/ads`);
      return response.ads || [];
   },

   approveAd: async (adId) => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/admin/ads/${adId}/approve`, {
         method: 'PATCH',
      });
   },

   hideAd: async (adId) => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/admin/ads/${adId}/hide`, {
         method: 'PATCH',
      });
   },

   unhideAd: async (adId) => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/admin/ads/${adId}/unhide`, {
         method: 'PATCH',
      });
   },

   deleteAd: async (adId) => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/admin/ads/${adId}`, {
         method: 'DELETE',
      });
   },
};

// Profile API
const profileAPI = {
   // Get current user's profile
   getProfile: async () => {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/me/profile`);
      return response.profile;
   },

   // Update current user's profile
   updateProfile: async (profileData) => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/me/profile`, {
         method: 'PUT',
         body: JSON.stringify(profileData)
      });
   },

   // Get notifications (legacy - using old /me/notifications)
   getNotifications: async () => {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/me/notifications`);
      return response.notifications;
   }
};

// Notification API service  
const notificationAPI = {
   // Get notifications with new backend
   getNotifications: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${API_BASE_URL}/notifications?${queryString}` : `${API_BASE_URL}/notifications`;
      return await makeAuthenticatedRequest(url);
   },

   // Mark notification as read
   markAsRead: async (notificationId) => {
      return await makeAuthenticatedRequest(`${API_BASE_URL}/notifications/${notificationId}/read`, {
         method: 'PATCH'
      });
   },

   // Mark all notifications as read
   markAllAsRead: async () => {
      return await makeAuthenticatedRequest(`${API_BASE_URL}/notifications/read-all`, {
         method: 'PATCH'
      });
   }
};

// Review API
const reviewAPI = {
   // Get all reviews for a trip
   getReviews: async (tripId) => {
      const response = await fetch(`${API_BASE_URL}/trips/${tripId}/reviews`);
      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.message || 'Failed to fetch reviews');
      }

      return data;
   },

   // Get current user's review for a trip
   getMyReview: async (tripId) => {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/trips/${tripId}/reviews/me`);
      return response.review;
   },

   // Create a new review
   createReview: async (tripId, reviewData) => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/trips/${tripId}/reviews`, {
         method: 'POST',
         body: JSON.stringify(reviewData)
      });
   },

   // Update existing review
   updateReview: async (tripId, reviewData) => {
      return makeAuthenticatedRequest(`${API_BASE_URL}/trips/${tripId}/reviews`, {
         method: 'PUT',
         body: JSON.stringify(reviewData)
      });
   }
};

// API service for ads
const adsAPI = {
   // Get all active ads with optional search/filter
   getAds: async (params = {}) => {
      try {
         const queryString = new URLSearchParams(params).toString();
         const url = queryString ? `${API_BASE_URL}/ads?${queryString}` : `${API_BASE_URL}/ads`;
         
         const response = await fetch(url);
         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch ads');
         }

         return data;
      } catch (error) {
         console.error('getAds error:', error);
         throw error;
      }
   },

   // Get ad details by ID
   getAdDetails: async (adId) => {
      try {
         const response = await fetch(`${API_BASE_URL}/ads/${adId}`);
         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch ad details');
         }

         return data.ad;
      } catch (error) {
         console.error('getAdDetails error:', error);
         throw error;
      }
   },

   // Get my ads (BRAND only)
   getMyAds: async (params = {}) => {
      try {
         const queryString = new URLSearchParams(params).toString();
         const url = queryString ? `${API_BASE_URL}/ads/my/list?${queryString}` : `${API_BASE_URL}/ads/my/list`;
         
         return makeAuthenticatedRequest(url);
      } catch (error) {
         console.error('getMyAds error:', error);
         throw error;
      }
   },

   // Create new ad (BRAND only)
   createAd: async (adData) => {
      try {
         return makeAuthenticatedRequest(`${API_BASE_URL}/ads`, {
            method: 'POST',
            body: JSON.stringify(adData)
         });
      } catch (error) {
         console.error('createAd error:', error);
         throw error;
      }
   },

   // Update ad (BRAND only - own ads)
   updateAd: async (adId, adData) => {
      try {
         return makeAuthenticatedRequest(`${API_BASE_URL}/ads/${adId}`, {
            method: 'PUT',
            body: JSON.stringify(adData)
         });
      } catch (error) {
         console.error('updateAd error:', error);
         throw error;
      }
   },

   // Delete ad (BRAND only - own ads)
   deleteAd: async (adId) => {
      try {
         return makeAuthenticatedRequest(`${API_BASE_URL}/ads/${adId}`, {
            method: 'DELETE'
         });
      } catch (error) {
         console.error('deleteAd error:', error);
         throw error;
      }
   }
};

export { authAPI, tripsAPI, adminAPI, profileAPI, notificationAPI, reviewAPI, adsAPI, makeAuthenticatedRequest, API_BASE_URL };