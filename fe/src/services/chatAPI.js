const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const chatFetch = async (path, options = {}) => {
   const token = localStorage.getItem('token');
   const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
         'Content-Type': 'application/json',
         ...(token && { Authorization: `Bearer ${token}` }),
         ...options.headers
      }
   });
   const data = await res.json();
   if (!res.ok) throw new Error(data.message || 'Request failed');
   return data;
};

const chatAPI = {
   getGroupMessages: (tripId, page = 1) =>
      chatFetch(`/trips/${tripId}/chat/messages/group?page=${page}&limit=50`),

   getDirectMessages: (tripId, userId, page = 1) =>
      chatFetch(`/trips/${tripId}/chat/messages/direct/${userId}?page=${page}&limit=50`),

   getConversations: (tripId) =>
      chatFetch(`/trips/${tripId}/chat/conversations`)
};

export default chatAPI;
