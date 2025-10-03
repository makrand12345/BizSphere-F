import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './admin/AdminDashboard';
import BusinessDashboard from './business/BusinessDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Redirect to admin dashboard if user is admin
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // Redirect to business dashboard if user is business owner
  if (user?.role === 'owner') {
    return <BusinessDashboard />;
  }

  // Regular dashboard for customers and riders
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1>BizSphere Dashboard</h1>
          <div className="nav-actions">
            <span>Welcome, {user?.name}</span>
            <span className="role-badge">{user?.role}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome to BizSphere, {user?.name}! 🎉</h2>
          <p>You are logged in as a <strong>{user?.role}</strong></p>
          {user?.businessName && <p>Business: <strong>{user.businessName}</strong></p>}
          
          {/* Show verification status for business owners */}
          {user?.role === 'owner' && (
            <div className={`verification-status ${user?.verificationStatus}`}>
              Verification Status: <strong>{user?.verificationStatus}</strong>
            </div>
          )}
          
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Coming Soon</h3>
              <p>Your dashboard features will appear here based on your role</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;