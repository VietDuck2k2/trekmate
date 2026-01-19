const Notification = require('../models/notification.model');

/**
 * Create notifications for join request events
 */
class NotificationService {
   /**
    * Create notification when a user requests to join a trip
    * @param {Object} trip - Trip document
    * @param {Object} requester - User who made the request
    */
   static async createJoinRequestNotifications(trip, requester) {
      try {
         const notifications = [];

         // Notify trip organizer
         notifications.push({
            user: trip.createdBy,
            type: 'JOIN_REQUEST_RECEIVED',
            trip: trip._id,
            fromUser: requester._id,
            message: `${requester.displayName} wants to join your trip "${trip.title}"`
         });

         // Notify all current members (excluding the requester)
         for (const memberId of trip.members) {
            if (memberId.toString() !== requester._id.toString() && 
                memberId.toString() !== trip.createdBy.toString()) {
               notifications.push({
                  user: memberId,
                  type: 'JOIN_REQUEST_RECEIVED',
                  trip: trip._id,
                  fromUser: requester._id,
                  message: `${requester.displayName} wants to join the trip "${trip.title}"`
               });
            }
         }

         if (notifications.length > 0) {
            await Notification.insertMany(notifications);
            console.log(`Created ${notifications.length} join request notifications`);
         }
      } catch (error) {
         console.error('Error creating join request notifications:', error);
      }
   }

   /**
    * Create notification when a join request is approved
    * @param {Object} trip - Trip document  
    * @param {Object} requester - User whose request was approved
    * @param {Object} organizer - Trip organizer who approved
    */
   static async createJoinRequestApprovedNotification(trip, requester, organizer) {
      try {
         await Notification.create({
            user: requester._id,
            type: 'JOIN_REQUEST_APPROVED',
            trip: trip._id,
            fromUser: organizer._id,
            message: `Your request to join "${trip.title}" has been approved!`
         });

         console.log(`Created join request approved notification for user ${requester._id}`);
      } catch (error) {
         console.error('Error creating join request approved notification:', error);
      }
   }

   /**
    * Create notification when a join request is rejected
    * @param {Object} trip - Trip document
    * @param {Object} requester - User whose request was rejected
    * @param {Object} organizer - Trip organizer who rejected
    */
   static async createJoinRequestRejectedNotification(trip, requester, organizer) {
      try {
         await Notification.create({
            user: requester._id,
            type: 'JOIN_REQUEST_REJECTED', 
            trip: trip._id,
            fromUser: organizer._id,
            message: `Your request to join "${trip.title}" was not approved`
         });

         console.log(`Created join request rejected notification for user ${requester._id}`);
      } catch (error) {
         console.error('Error creating join request rejected notification:', error);
      }
   }
}

module.exports = NotificationService;