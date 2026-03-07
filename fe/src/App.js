import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ChatProvider } from './contexts/ChatContext';
import Layout from './components/Layout';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

// Page imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TripDetailPage from './pages/TripDetailPage';
import MyTripsPage from './pages/MyTripsPage';
import CreateTripPage from './pages/CreateTripPage';
import EditTripPage from './pages/EditTripPage';
import ProfilePage from './pages/ProfilePage';
import AdsPage from './pages/AdsPage';
import BrandDashboard from './pages/BrandDashboard';
import CreateAdPage from './pages/CreateAdPage';
import EditAdPage from './pages/EditAdPage';
import NotificationCenter from './pages/NotificationCenter';
import ChatPage from './pages/ChatPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminTripsPage from './pages/admin/AdminTripsPage';
import AdminAdsPage from './pages/admin/AdminAdsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LoginSuccess from './pages/LoginSuccess';

// Styles
import './styles/global.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ChatProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/ads" element={<AdsPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/login-success" element={<LoginSuccess />} />

              {/* Trip routes - IMPORTANT: specific routes must come before parameterized routes */}
              <Route path="/trips/create" element={
                <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                  <CreateTripPage />
                </ProtectedRoute>
              } />
              <Route path="/trips/:id/edit" element={
                <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                  <EditTripPage />
                </ProtectedRoute>
              } />
              <Route path="/trips/:id" element={<TripDetailPage />} />
              <Route path="/trips/:id/chat" element={
                <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                  <ChatPage />
                </ProtectedRoute>
              } />

              {/* Auth routes (redirect if already logged in) */}
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } />

              {/* Protected USER routes */}
              <Route path="/my-trips" element={
                <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                  <MyTripsPage />
                </ProtectedRoute>
              } />            <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['USER', 'BRAND', 'ADMIN']}>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute allowedRoles={['USER', 'BRAND', 'ADMIN']}>
                  <NotificationCenter />
                </ProtectedRoute>
              } />
              {/* Protected BRAND routes */}
              <Route path="/brand" element={
                <ProtectedRoute requiredRole="BRAND">
                  <BrandDashboard />
                </ProtectedRoute>
              } />
              <Route path="/brand/ads/create" element={
                <ProtectedRoute requiredRole="BRAND">
                  <CreateAdPage />
                </ProtectedRoute>
              } />
              <Route path="/brand/ads/edit/:id" element={
                <ProtectedRoute requiredRole="BRAND">
                  <EditAdPage />
                </ProtectedRoute>
              } />

              {/* Protected ADMIN routes */}
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminUsersPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/trips" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminTripsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/ads" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminAdsPage />
                </ProtectedRoute>
              } />

              {/* 404 fallback */}
              <Route path="*" element={<div className="page-container"><h1>Page Not Found</h1><p>The page you're looking for doesn't exist.</p></div>} />
            </Routes>
          </Router>
        </ChatProvider>
      </NotificationProvider>
    </AuthProvider >
  );
}

export default App;
