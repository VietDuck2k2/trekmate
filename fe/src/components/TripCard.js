import React from 'react';
import { Link } from 'react-router-dom';

const TripCard = ({ trip, showRole = false, role = null }) => {
   const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric'
      });
   };

   const getDifficultyColorClass = (difficulty) => {
      switch (difficulty?.toLowerCase()) {
         case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
         case 'moderate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
         case 'hard': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
         case 'extreme': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
         default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      }
   };

   return (
      <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group">
         {/* Cover Image */}
         <div className="relative h-36 w-full overflow-hidden">
            <img
               src={trip.coverImageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
               alt={trip.title}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
               }}
            />
            {showRole && role && (
               <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-md ${role === 'ORGANIZER'
                     ? 'bg-amber-400 text-black'
                     : 'bg-cyan-500 text-white'
                     }`}>
                     {role}
                  </span>
               </div>
            )}
            {trip.photos && trip.photos.length > 0 && (
               <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                  <span className="material-icons-outlined text-[10px]">photo_camera</span>
                  <span>+{trip.photos.length}</span>
               </div>
            )}
         </div>

         {/* Content */}
         <div className="p-4">
            <div className="mb-3">
               <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  <Link to={`/trips/${trip._id}`}>
                     {trip.title}
                  </Link>
               </h3>

               <div className="flex items-center gap-2 mb-2">
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${getDifficultyColorClass(trip.difficulty)}`}>
                     {trip.difficulty || 'Unknown'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                     <span className="material-icons-outlined text-[11px]">location_on</span>
                     <span className="truncate max-w-[120px]">{trip.location || 'Location TBD'}</span>
                  </div>
               </div>

               {trip.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed h-8">
                     {trip.description}
                  </p>
               )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                     <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                        {trip.createdBy?.avatarUrl ? (
                           <img src={trip.createdBy.avatarUrl} alt={trip.createdBy.displayName} className="w-full h-full object-cover" />
                        ) : (
                           <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">
                              {(trip.createdBy?.displayName || 'U')[0]?.toUpperCase()}
                           </span>
                        )}
                     </div>
                     <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-[80px]">
                        {trip.createdBy?.displayName || 'Anonymous'}
                     </span>
                  </div>
                  <span className="text-[10px] text-slate-400 pl-6">
                     {trip.members?.length || 0} members
                  </span>
               </div>

               <div className="flex flex-col items-end gap-0.5">
                  {trip.startDate && (
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        {formatDate(trip.startDate)}
                     </span>
                  )}
                  <Link
                     to={`/trips/${trip._id}`}
                     className="text-primary text-[10px] font-bold hover:underline"
                  >
                     View Details
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default TripCard;