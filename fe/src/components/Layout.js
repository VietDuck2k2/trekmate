import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

const Layout = ({ children, transparentNav = false }) => {
   const navigate = useNavigate();
   const location = useLocation();
   const [scrolled, setScrolled] = useState(false);
   const [showNotifications, setShowNotifications] = useState(false);
   const hoverTimeout = useRef(null);
   const { user, isAuthenticated, logout } = useAuth();
   const { totalUnread } = useNotifications();

   useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 50);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   const handleMouseEnter = () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      setShowNotifications(true);
   };

   const handleMouseLeave = () => {
      hoverTimeout.current = setTimeout(() => {
         setShowNotifications(false);
      }, 300); // Small delay to prevent flickering
   };

   const handleLogout = () => {
      logout();
      navigate('/login');
   };

   const navClasses = transparentNav && !scrolled
      ? 'bg-transparent text-white'
      : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm';

   const getNavLinkClass = (path) => {
      const isHome = path === '/';
      const isActive = isHome
         ? location.pathname === '/' || (location.pathname.startsWith('/trips/') && location.pathname !== '/trips/create')
         : location.pathname.startsWith(path);

      const baseClasses = "px-4 py-2 rounded-full transition-all duration-200 font-bold text-sm flex items-center gap-2";
      const activeClasses = "bg-primary text-white shadow-md shadow-primary/20";
      const inactiveClasses = transparentNav && !scrolled
         ? "text-white/90 hover:bg-white/10 hover:text-white"
         : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white";

      return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
   };

   return (
      <div className="min-h-screen font-jakarta">
         <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 ${navClasses}`}>
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
               <Link to="/" className="flex items-center gap-2">
                  <span className={`material-icons-outlined text-3xl ${transparentNav && !scrolled ? 'text-white' : 'text-primary'}`}>terrain</span>
                  <span className={`text-2xl font-bold font-display tracking-tight ${transparentNav && !scrolled ? 'text-white' : 'text-primary'}`}>TrekMate</span>
               </Link>

               <div className="hidden md:flex items-center gap-2 font-medium">
                  <Link to="/" className={getNavLinkClass('/')}>
                     <span className="material-icons-outlined text-[18px]">explore</span>
                     Trips
                  </Link>
                  <Link to="/ads" className={getNavLinkClass('/ads')}>
                     <span className="material-icons-outlined text-[18px]">campaign</span>
                     Ads
                  </Link>
                  {isAuthenticated() && (
                     <Link to="/my-trips" className={getNavLinkClass('/my-trips')}>
                        <span className="material-icons-outlined text-[18px]">backpack</span>
                        My Trips
                     </Link>
                  )}
                  {isAuthenticated() && (
                     <Link to="/profile" className={getNavLinkClass('/profile')}>
                        <span className="material-icons-outlined text-[18px]">person</span>
                        Profile
                     </Link>
                  )}
                  <div className="mx-2 h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                  <Link to="/trips/create" className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-primary/25 flex items-center gap-2 ${transparentNav && !scrolled ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-primary text-white hover:bg-emerald-700'}`}>
                     <span className="material-icons-outlined text-[18px]">add_circle</span>
                     Create Trip
                  </Link>

                  {user?.role === 'ADMIN' && (
                     <div className="flex items-center gap-2 pl-4 ml-2 border-l border-slate-300 dark:border-slate-700">
                        <Link to="/admin/users" className={getNavLinkClass('/admin/users')}>
                           <span className="material-icons-outlined text-[18px]">manage_accounts</span>
                           Users
                        </Link>
                        <Link to="/admin/trips" className={getNavLinkClass('/admin/trips')}>
                           <span className="material-icons-outlined text-[18px]">flight_takeoff</span>
                           Trips
                        </Link>
                        <Link to="/admin/ads" className={getNavLinkClass('/admin/ads')}>
                           <span className="material-icons-outlined text-[18px]">stars</span>
                           Ads
                        </Link>
                     </div>
                  )}
               </div>

               <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                     {isAuthenticated() ? (
                        <>
                           <div
                              className="relative"
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                           >
                              <Link
                                 to="/notifications"
                                 className={`relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center ${transparentNav && !scrolled ? 'text-white hover:bg-white/20' : 'text-slate-600 dark:text-slate-300'}`}
                              >
                                 <span className="material-icons-outlined text-2xl">notifications</span>
                                 {totalUnread > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm animate-pulse-subtle">
                                       {totalUnread > 9 ? '9+' : totalUnread}
                                    </span>
                                 )}
                              </Link>

                              {showNotifications && (
                                 <div className="absolute top-full right-0 pt-2 w-[340px] sm:w-[400px]">
                                    <NotificationDropdown onClose={() => setShowNotifications(false)} />
                                 </div>
                              )}
                           </div>
                           <Link to="/profile" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden">
                              {user?.avatarUrl ? (
                                 <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                              ) : (
                                 user?.displayName?.[0]?.toUpperCase() || 'U'
                              )}
                           </Link>
                           <span className={`hidden lg:inline font-semibold ${transparentNav && !scrolled ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                              {user?.displayName || 'User'}
                           </span>
                           <button onClick={handleLogout} className="hover:text-red-400 transition-colors ml-2">
                              <span className="material-icons-outlined">logout</span>
                           </button>
                        </>
                     ) : (
                        <>
                           <Link to="/login" className={`font-semibold hover:underline ${transparentNav && !scrolled ? 'text-white' : 'text-slate-800 dark:text-white'}`}>Login</Link>
                           <Link to="/register" className={`px-4 py-2 rounded-full font-bold ml-2 ${transparentNav && !scrolled ? 'bg-white text-primary' : 'bg-primary text-white'}`}>Register</Link>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </nav>

         <main>{children}</main>

         <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-2 opacity-50">
                  <span className="material-icons-outlined text-2xl text-primary">terrain</span>
                  <span className="text-xl font-bold font-display tracking-tight">TrekMate</span>
               </div>
               <div className="flex gap-8 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <a href="#" className="hover:text-primary">About</a>
                  <a href="#" className="hover:text-primary">Terms</a>
                  <a href="#" className="hover:text-primary">Privacy</a>
                  <a href="#" className="hover:text-primary">Help</a>
               </div>
               <p className="text-xs text-slate-400 dark:text-slate-500">
                  © 2026 TrekMate. Nature awaits.
               </p>
            </div>
         </footer>
      </div>
   );
};

export default Layout;