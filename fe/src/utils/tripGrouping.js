/**
 * Utility functions for trip time-based grouping
 */

/**
 * Get the time status of a trip based on current date
 * @param {Object} trip - Trip object with startDate and endDate
 * @returns {string} - 'completed', 'ongoing', or 'upcoming'
 */
export const getTripTimeStatus = (trip) => {
   const now = new Date();
   const startDate = new Date(trip.startDate);
   const endDate = trip.endDate ? new Date(trip.endDate) : null;

   // Completed: endDate < now
   if (endDate && endDate < now) {
      return 'completed';
   }

   // Ongoing: startDate <= now <= endDate (or no endDate)
   if (startDate <= now) {
      return 'ongoing';
   }

   // Upcoming: startDate > now
   return 'upcoming';
};

/**
 * Group trips by their time status
 * @param {Array} trips - Array of trip objects
 * @returns {Object} - Object with completed, ongoing, and upcoming arrays
 */
export const groupTripsByTimeStatus = (trips) => {
   const groups = {
      completed: [],
      ongoing: [],
      upcoming: []
   };

   trips.forEach(trip => {
      const status = getTripTimeStatus(trip);
      groups[status].push(trip);
   });

   return groups;
};

/**
 * Get display name and description for time status groups
 * @param {string} status - 'completed', 'ongoing', or 'upcoming'
 * @returns {Object} - Object with title and emptyMessage
 */
export const getGroupDisplayInfo = (status) => {
   const info = {
      completed: {
         title: 'Completed Trips',
         emptyMessage: "No completed trips yet.",
         icon: '✓'
      },
      ongoing: {
         title: 'Ongoing Trips',
         emptyMessage: "No ongoing trips right now.",
         icon: '🚀'
      },
      upcoming: {
         title: 'Upcoming Trips',
         emptyMessage: "No upcoming trips yet.",
         icon: '📅'
      }
   };

   return info[status] || { title: 'Unknown', emptyMessage: 'No trips found.', icon: '?' };
};