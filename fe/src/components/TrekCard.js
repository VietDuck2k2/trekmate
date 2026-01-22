import React from 'react';
import { Link } from 'react-router-dom';

const TrekCard = ({ trek }) => {
   // Helper for difficulty color
   const getDifficultyColorClass = (diff) => {
      switch (diff?.toLowerCase()) {
         case 'easy': return 'bg-emerald-500/90';
         case 'moderate': return 'bg-orange-500/90';
         case 'hard': return 'bg-red-500/90';
         case 'extreme': return 'bg-rose-600/90';
         default: return 'bg-slate-500/90';
      }
   }

   const organizerName = trek.createdBy?.displayName || 'Unknown';
   const organizerInitial = organizerName[0]?.toUpperCase();

   return (
      <Link to={`/trips/${trek._id}`} className="group cursor-pointer block">
         <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 dark:border-slate-700 h-full flex flex-col">
            <div className="relative overflow-hidden aspect-video">
               <img
                  alt={trek.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  src={trek.coverImageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'; }}
               />
               <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg ${getDifficultyColorClass(trek.difficulty)}`}>
                     {trek.difficulty || 'General'}
                  </span>
               </div>
               <div className="absolute top-3 right-3">
                  <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors flex items-center justify-center">
                     <span className="material-icons-outlined text-lg">favorite_border</span>
                  </button>
               </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
               <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <span className="material-icons-outlined text-xs">location_on</span>
                  <span className="truncate">{trek.location}</span>
               </div>
               <h3 className="text-lg font-bold mb-2 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{trek.title}</h3>
               <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 mb-4 flex-1">{trek.description}</p>
               <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700 mt-auto">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[8px] font-bold uppercase overflow-hidden text-slate-700 dark:text-slate-300">
                        {trek.createdBy?.avatarUrl ? (
                           <img src={trek.createdBy.avatarUrl} alt={organizerName} className="w-full h-full object-cover" />
                        ) : (
                           organizerInitial
                        )}
                     </div>
                     <span className="text-xs font-semibold dark:text-slate-300 truncate max-w-[80px]">{organizerName}</span>
                  </div>
                  <div className="text-right">
                     <span className="block text-[9px] uppercase font-bold text-slate-400">
                        {new Date(trek.startDate).toLocaleDateString()}
                     </span>
                     <span className="text-xs font-bold text-primary">{trek.members?.length || 0} members</span>
                  </div>
               </div>
            </div>
         </div>
      </Link>
   );
};

export default TrekCard;
