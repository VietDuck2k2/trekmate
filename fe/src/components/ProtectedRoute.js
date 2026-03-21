import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Component to protect routes that require authentication
const ProtectedRoute = ({ children, requiredRole = null, allowedRoles = null }) => {
   const { isAuthenticated, hasRole, loading } = useAuth();
   const location = useLocation();

   // Show loading while checking auth status
   if (loading) {
      return (
         <div className="page-container">
            <div style={{ textAlign: 'center', padding: '50px' }}>
               <h2>Đang tải...</h2>
            </div>
         </div>
      );
   }

   // If not authenticated, redirect to login with return path
   if (!isAuthenticated()) {
      return <Navigate to="/login" state={{ from: location }} replace />;
   }

   // Check specific role requirement
   if (requiredRole && !hasRole(requiredRole)) {
      return (
         <div className="page-container">
            <div style={{ textAlign: 'center', padding: '50px' }}>
               <h2>Từ Chối Quyền Truy Cập</h2>
               <p>Bạn không có quyền truy cập trang này.</p>
               <p>Vai trò bắt buộc: {requiredRole}</p>
            </div>
         </div>
      );
   }

   // Check allowed roles (array of roles)
   if (allowedRoles && !allowedRoles.some(role => hasRole(role))) {
      return (
         <div className="page-container">
            <div style={{ textAlign: 'center', padding: '50px' }}>
               <h2>Từ Chối Quyền Truy Cập</h2>
               <p>Bạn không có quyền truy cập trang này.</p>
               <p>Các vai trò bắt buộc: {allowedRoles.join(', ')}</p>
            </div>
         </div>
      );
   }

   return children;
};

// Component to redirect authenticated users away from auth pages
const PublicRoute = ({ children }) => {
   const { isAuthenticated, user, loading } = useAuth();

   // Show loading while checking auth status
   if (loading) {
      return (
         <div className="page-container">
            <div style={{ textAlign: 'center', padding: '50px' }}>
               <h2>Đang tải...</h2>
            </div>
         </div>
      );
   }

   // If authenticated, redirect to appropriate dashboard
   if (isAuthenticated()) {
      switch (user?.role) {
         case 'ADMIN':
            return <Navigate to="/admin/users" replace />;
         case 'BRAND':
            return <Navigate to="/brand" replace />;
         case 'USER':
         default:
            return <Navigate to="/" replace />;
      }
   }

   return children;
};

export { ProtectedRoute, PublicRoute };