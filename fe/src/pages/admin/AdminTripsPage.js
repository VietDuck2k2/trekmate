import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Layout from '../../components/Layout';

const AdminTripsPage = () => {
   const [trips, setTrips] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [actionLoading, setActionLoading] = useState({});

   useEffect(() => {
      loadTrips();
   }, []);

   const loadTrips = async () => {
      try {
         setLoading(true);
         setError(null);
         const data = await adminAPI.getTrips();
         setTrips(data);
      } catch (err) {
         setError(err.message || 'Failed to load trips');
      } finally {
         setLoading(false);
      }
   };

   const handleHideTrip = async (tripId) => {
      try {
         setActionLoading(prev => ({ ...prev, [tripId]: 'hiding' }));
         await adminAPI.hideTrip(tripId);
         loadTrips();
      } catch (err) {
         alert('Failed to hide trip: ' + err.message);
      } finally {
         setActionLoading(prev => ({ ...prev, [tripId]: null }));
      }
   };

   const handleUnhideTrip = async (tripId) => {
      try {
         setActionLoading(prev => ({ ...prev, [tripId]: 'unhiding' }));
         await adminAPI.unhideTrip(tripId);
         loadTrips();
      } catch (err) {
         alert('Failed to unhide trip: ' + err.message);
      } finally {
         setActionLoading(prev => ({ ...prev, [tripId]: null }));
      }
   };

   const handleDeleteTrip = async (tripId, tripTitle) => {
      if (!window.confirm(`Are you sure you want to delete "${tripTitle}"? This cannot be undone.`)) {
         return;
      }

      try {
         setActionLoading(prev => ({ ...prev, [tripId]: 'deleting' }));
         await adminAPI.deleteTrip(tripId);
         loadTrips();
      } catch (err) {
         alert('Failed to delete trip: ' + err.message);
      } finally {
         setActionLoading(prev => ({ ...prev, [tripId]: null }));
      }
   };

   const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric'
      });
   };

   return (
      <Layout>
         <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 mt-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
               <div>
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Trips Management</h1>
                  <p className="text-slate-500 dark:text-slate-400">Manage all community trips and activities.</p>
               </div>
               <button
                  onClick={loadTrips}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-bold transition-all flex items-center gap-2"
               >
                  <span className="material-icons-round text-sm">refresh</span>
                  Refresh List
               </button>
            </div>

            {loading ? (
               <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
               </div>
            ) : error ? (
               <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center gap-4">
                  <span className="material-icons-round text-2xl">error_outline</span>
                  <div className="flex-grow">
                     <p className="font-bold">Error loading trips</p>
                     <p className="text-sm">{error}</p>
                  </div>
                  <button onClick={loadTrips} className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 font-bold text-sm">Retry</button>
               </div>
            ) : (!trips || trips.length === 0) ? (
               <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                  <p className="text-slate-500 font-bold">No trips found.</p>
               </div>
            ) : (
               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                              <th className="p-6 font-bold">Trip Details</th>
                              <th className="p-6 font-bold">Creator</th>
                              <th className="p-6 font-bold">Status</th>
                              <th className="p-6 font-bold">Members</th>
                              <th className="p-6 font-bold">Created</th>
                              <th className="p-6 font-bold">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                           {trips.map(trip => (
                              <tr key={trip._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                 <td className="p-6 max-w-xs">
                                    <div className="font-bold text-slate-900 dark:text-white">{trip.title}</div>
                                    {trip.description && (
                                       <div className="text-xs text-slate-500 line-clamp-1 mt-1">
                                          {trip.description}
                                       </div>
                                    )}
                                 </td>
                                 <td className="p-6">
                                    <div className="flex items-center gap-2">
                                       <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                          {trip.creator?.avatarUrl ? (
                                             <img src={trip.creator.avatarUrl} alt={trip.creator.displayName} className="w-full h-full object-cover" />
                                          ) : (
                                             <span className="font-bold text-[10px] text-slate-500 dark:text-slate-300">
                                                {(trip.creator?.displayName || trip.creator?.email || 'U')[0].toUpperCase()}
                                             </span>
                                          )}
                                       </div>
                                       <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                                          {trip.creator?.displayName || trip.creator?.email || 'Unknown'}
                                       </span>
                                    </div>
                                 </td>
                                 <td className="p-6">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${trip.status === 'ACTIVE'
                                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                       }`}>
                                       {trip.status}
                                    </span>
                                 </td>
                                 <td className="p-6 text-sm text-slate-600 dark:text-slate-400 font-bold">
                                    {trip.members ? trip.members.length : 0}
                                 </td>
                                 <td className="p-6 text-sm text-slate-500 whitespace-nowrap">
                                    {formatDate(trip.createdAt)}
                                 </td>
                                 <td className="p-6">
                                    <div className="flex items-center gap-2">
                                       {trip.status === 'ACTIVE' ? (
                                          <button
                                             onClick={() => handleHideTrip(trip._id)}
                                             disabled={actionLoading[trip._id]}
                                             className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                          >
                                             {actionLoading[trip._id] === 'hiding' ? 'Hiding...' : 'Hide'}
                                          </button>
                                       ) : (
                                          <button
                                             onClick={() => handleUnhideTrip(trip._id)}
                                             disabled={actionLoading[trip._id]}
                                             className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                          >
                                             {actionLoading[trip._id] === 'unhiding' ? 'Unhiding...' : 'Unhide'}
                                          </button>
                                       )}
                                       <button
                                          onClick={() => handleDeleteTrip(trip._id, trip.title)}
                                          disabled={actionLoading[trip._id]}
                                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                       >
                                          {actionLoading[trip._id] === 'deleting' ? '...' : 'Delete'}
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}
         </div>
      </Layout>
   );
};

export default AdminTripsPage;