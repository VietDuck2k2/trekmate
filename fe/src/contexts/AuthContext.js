import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [token, setToken] = useState(null);
   const [loading, setLoading] = useState(true);

   // Load user data from localStorage on app start
   useEffect(() => {
      try {
         const savedToken = localStorage.getItem('token');
         const savedUser = localStorage.getItem('user');

         if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
         }
      } catch (error) {
         console.error('Error loading auth data:', error);
         localStorage.removeItem('token');
         localStorage.removeItem('user');
      } finally {
         setLoading(false);
      }
   }, []);

   // Login function
   const login = (userData, authToken) => {
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);
   };

   // Logout function
   const logout = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
   };

   // Check if user has specific role
   const hasRole = (role) => {
      return user?.role === role;
   };

   // Check if user is authenticated
   const isAuthenticated = () => {
      return !!user && !!token && user.status !== 'BLOCKED';
   };

   // Check if user account is active
   const isActive = () => {
      return user?.status === 'ACTIVE' || user?.status === undefined; // undefined for backward compatibility
   };

   // Update user data
   const updateUser = (updatedUser) => {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
   };

   const value = {
      user,
      token,
      loading,
      login,
      logout,
      hasRole,
      isAuthenticated,
      isActive,
      updateUser
   };

   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   );
};

// Custom hook to use auth context
export const useAuth = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};