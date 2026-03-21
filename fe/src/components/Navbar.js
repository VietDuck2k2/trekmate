import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import './Navbar.css';

const Navbar = () => {
   const { user, isAuthenticated, isActive, logout, hasRole } = useAuth();
   const { totalUnread } = useNotifications();
   const navigate = useNavigate();

   const [showNotifications, setShowNotifications] = useState(false);
   const notificationRef = useRef(null);

   const handleLogout = () => {
      logout();
      navigate('/');
   };

   // Close notification dropdown when clicking outside
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (notificationRef.current && !notificationRef.current.contains(event.target)) {
            setShowNotifications(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   // Don't show navigation if user is blocked
   if (isAuthenticated() && !isActive()) {
      return (
         <nav className="navbar">
            <div className="navbar-container">
               <Link to="/" className="navbar-brand">TrekMate</Link>
               <div className="navbar-nav">
                  <div className="user-menu">
                     <span className="user-name blocked">Tài khoản bị khóa</span>
                     <button onClick={handleLogout} className="logout-btn">
                        Đăng xuất
                     </button>
                  </div>
               </div>
            </div>
         </nav>
      );
   }

   return (
      <nav className="navbar">
         <div className="navbar-container">
            {/* Logo/Brand */}
            <Link to="/" className="navbar-brand">
               TrekMate
            </Link>

            {/* Navigation Links */}
            <div className="navbar-nav">
               {/* Always visible links */}
               <Link to="/" className="nav-link">Chuyến đi</Link>
               <Link to="/ads" className="nav-link">Quảng cáo</Link>

               {/* Guest links (not authenticated) */}
               {!isAuthenticated() && (
                  <>
                     <Link to="/login" className="nav-link">Đăng nhập</Link>
                     <Link to="/register" className="nav-link">Đăng ký</Link>
                  </>
               )}

               {/* User links (authenticated as USER) */}
               {isAuthenticated() && hasRole('USER') && (
                  <>
                     <Link to="/my-trips" className="nav-link">Chuyến đi của tôi</Link>
                     <Link to="/trips/create" className="nav-link">Tạo chuyến đi</Link>
                     <Link to="/profile" className="nav-link">Hồ sơ</Link>
                  </>
               )}

               {/* Brand links (authenticated as BRAND) */}
               {isAuthenticated() && hasRole('BRAND') && (
                  <>
                     <Link to="/brand" className="nav-link">Quảng cáo của tôi</Link>
                     <Link to="/profile" className="nav-link">Hồ sơ</Link>
                  </>
               )}

               {/* Admin links (authenticated as ADMIN) */}
               {isAuthenticated() && hasRole('ADMIN') && (
                  <div className="admin-dropdown">
                     <span className="nav-link admin-toggle">Quản trị ▼</span>
                     <div className="admin-dropdown-content">
                        <Link to="/admin/users" className="dropdown-link">Người dùng</Link>
                        <Link to="/admin/trips" className="dropdown-link">Chuyến đi</Link>
                        <Link to="/admin/ads" className="dropdown-link">Quảng cáo</Link>
                     </div>
                  </div>
               )}

               {/* User info and logout (authenticated) */}
               {isAuthenticated() && (
                  <>
                     {/* Notification Icon */}
                     <div style={{ position: 'relative' }} ref={notificationRef}>
                        <button
                           onClick={() => setShowNotifications(!showNotifications)}
                           style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '18px',
                              color: '#333',
                              padding: '8px',
                              borderRadius: '4px',
                              position: 'relative',
                              ':hover': { backgroundColor: '#f8f9fa' }
                           }}
                           onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                           onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                           title="Thông báo"
                        >
                           🔔
                           {totalUnread > 0 && (
                              <span style={{
                                 position: 'absolute',
                                 top: '2px',
                                 right: '2px',
                                 backgroundColor: '#dc3545',
                                 color: 'white',
                                 borderRadius: '50%',
                                 width: '16px',
                                 height: '16px',
                                 fontSize: '10px',
                                 fontWeight: 'bold',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 minWidth: '16px'
                              }}>
                                 {totalUnread > 99 ? '99+' : totalUnread}
                              </span>
                           )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                           <NotificationDropdown
                              onClose={() => setShowNotifications(false)}
                           />
                        )}
                     </div>

                     {/* User Menu */}
                     <div className="user-menu">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           {user?.avatarUrl ? (
                              <img
                                 src={user.avatarUrl}
                                 alt={user.displayName || 'User'}
                                 style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                 }}
                              />
                           ) : (
                              <span style={{
                                 backgroundColor: '#007bff',
                                 color: 'white',
                                 width: '24px',
                                 height: '24px',
                                 borderRadius: '50%',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 fontSize: '10px',
                                 fontWeight: 'bold'
                              }}>
                                 {(user?.displayName || 'U')[0].toUpperCase()}
                              </span>
                           )}
                           <span className="user-name">
                              {user?.displayName} ({user?.role})
                           </span>
                        </div>
                        <button onClick={handleLogout} className="logout-btn">
                           Đăng xuất
                        </button>
                     </div>
                  </>
               )}
            </div>
         </div>
      </nav>
   );
};

export default Navbar;