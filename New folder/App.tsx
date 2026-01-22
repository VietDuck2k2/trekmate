
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import CreateTripPage from './pages/CreateTripPage';
import TripDetailsPage from './pages/TripDetailsPage';
import AdsPage from './pages/AdsPage';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create" element={<CreateTripPage />} />
        <Route path="/details/:id" element={<TripDetailsPage />} />
        <Route path="/ads" element={<AdsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
