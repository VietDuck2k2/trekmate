const jwt = require('jsonwebtoken');
const Message = require('../models/message.model');
const Trip = require('../models/trip.model');
const User = require('../models/user.model');

// Helper: verify JWT and get user
const verifyToken = async (token) => {
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   const user = await User.findById(decoded.userId || decoded.id).select('-password');
   return user;
};

// Helper: check membership
const isTripMember = async (tripId, userId) => {
   const trip = await Trip.findById(tripId).lean();
   if (!trip) return false;
   return (
      trip.createdBy.toString() === userId.toString() ||
      trip.members.some(m => m.toString() === userId.toString())
   );
};

const initSocket = (io) => {
   // Auth middleware for Socket.IO
   io.use(async (socket, next) => {
      try {
         const token = socket.handshake.auth?.token || socket.handshake.query?.token;
         if (!token) return next(new Error('Authentication error: No token'));
         const user = await verifyToken(token);
         if (!user) return next(new Error('Authentication error: Invalid token'));
         socket.user = user;
         next();
      } catch (err) {
         next(new Error('Authentication error: ' + err.message));
      }
   });

   io.on('connection', (socket) => {
      console.log(`[Socket] User connected: ${socket.user.displayName} (${socket.user._id})`);

      // ─── Join trip room ───────────────────────────────────────────────────────
      socket.on('join_trip', async ({ tripId }) => {
         try {
            const allowed = await isTripMember(tripId, socket.user._id);
            if (!allowed) {
               socket.emit('error', { message: 'You are not a member of this trip' });
               return;
            }
            socket.join(`trip:${tripId}`);
            socket.join(`user:${socket.user._id}`); // Personal room for DMs
            console.log(`[Socket] ${socket.user.displayName} joined trip:${tripId}`);
         } catch (err) {
            socket.emit('error', { message: 'Failed to join trip room' });
         }
      });

      // ─── Send message ─────────────────────────────────────────────────────────
      socket.on('send_message', async ({ tripId, type, receiverId, content }) => {
         try {
            // Validate
            if (!content || !content.trim()) return;
            if (!['group', 'direct'].includes(type)) return;

            // Auth check
            const allowed = await isTripMember(tripId, socket.user._id);
            if (!allowed) {
               socket.emit('error', { message: 'Access denied' });
               return;
            }

            // For DMs, validate receiver is also a member
            if (type === 'direct') {
               const receiverAllowed = await isTripMember(tripId, receiverId);
               if (!receiverAllowed) {
                  socket.emit('error', { message: 'Receiver is not in this trip' });
                  return;
               }
            }

            // Save to DB
            const message = new Message({
               trip: tripId,
               type,
               sender: socket.user._id,
               receiver: type === 'direct' ? receiverId : null,
               content: content.trim().substring(0, 2000),
               readBy: [socket.user._id]
            });
            await message.save();
            await message.populate('sender', 'displayName avatarUrl');
            if (type === 'direct') await message.populate('receiver', 'displayName avatarUrl');

            const msgData = message.toObject();

            // Broadcast
            if (type === 'group') {
               io.to(`trip:${tripId}`).emit('new_message', msgData);
            } else {
               // DM: only sender and receiver
               socket.emit('new_message', msgData);
               io.to(`user:${receiverId}`).emit('new_message', msgData);
            }
         } catch (err) {
            console.error('[Socket] send_message error:', err);
            socket.emit('error', { message: 'Failed to send message' });
         }
      });

      // ─── Mark as read ─────────────────────────────────────────────────────────
      socket.on('mark_as_read', async ({ tripId, type, partnerId }) => {
         try {
            const query = {
               trip: tripId,
               readBy: { $ne: socket.user._id }
            };
            if (type === 'group') {
               query.type = 'group';
            } else {
               query.type = 'direct';
               query.$or = [
                  { sender: partnerId, receiver: socket.user._id },
                  { sender: socket.user._id, receiver: partnerId }
               ];
            }
            await Message.updateMany(query, { $addToSet: { readBy: socket.user._id } });
            socket.emit('messages_read', { tripId, type, partnerId });
         } catch (err) {
            console.error('[Socket] mark_as_read error:', err);
         }
      });

      // ─── Disconnect ───────────────────────────────────────────────────────────
      socket.on('disconnect', () => {
         console.log(`[Socket] User disconnected: ${socket.user.displayName}`);
      });
   });
};

module.exports = initSocket;
