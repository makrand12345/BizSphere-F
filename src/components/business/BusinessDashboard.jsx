import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../services/products';
import ProductManagement from './ProductManagement';
import './BusinessDashboard.css';

const BusinessDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'owner' && user?.businessVerified) {
      fetchBusinessStats();
    }
  }, [user]);

  const fetchBusinessStats = async () => {
    try {
      const token = localStorage.getItem('bizsphere_token');
      const statsData = await productAPI.getBusinessStats(token);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch business stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading Business Dashboard...</div>;
  }

  return (
    <div className="business-dashboard">
      <nav className="business-nav">
        <div className="nav-content">
          <div className="business-header">
            <h1>{user.businessName}</h1>
            <span className="business-role">Business Owner</span>
          </div>
          <div className="nav-actions">
            <span>Welcome, {user.name}</span>
            <div className={`verification-badge ${user.verificationStatus}`}>
              {user.verificationStatus}
            </div>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="business-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          📦 Products
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          📋 Orders
        </button>
        <button 
          className={activeTab === 'deliveries' ? 'active' : ''}
          onClick={() => setActiveTab('deliveries')}
        >
          🚚 Deliveries
        </button>
      </div>

      <div className="business-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <h2>Business Overview</h2>
            
            {!user.businessVerified ? (
              <div className="verification-pending">
                <h3>⏳ Business Verification Pending</h3>
                <p>Your business is under review. You'll be able to manage products and receive orders once approved.</p>
                <div className="pending-stats">
                  <p><strong>Status:</strong> {user.verificationStatus}</p>
                  {user.verificationNotes && <p><strong>Notes:</strong> {user.verificationNotes}</p>}
                </div>
              </div>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card total-products">
                    <h3>Total Products</h3>
                    <div className="stat-number">{stats?.totalProducts || 0}</div>
                    <div className="stat-subtitle">In your catalog</div>
                  </div>
                  
                  <div className="stat-card active-products">
                    <h3>Active Products</h3>
                    <div className="stat-number">{stats?.activeProducts || 0}</div>
                    <div className="stat-subtitle">Available for sale</div>
                  </div>
                  
                  <div className="stat-card low-stock">
                    <h3>Low Stock</h3>
                    <div className="stat-number">{stats?.lowStockProducts || 0}</div>
                    <div className="stat-subtitle">Need restocking</div>
                  </div>
                  
                  <div className="stat-card total-orders">
                    <h3>Total Orders</h3>
                    <div className="stat-number">0</div>
                    <div className="stat-subtitle">All time</div>
                  </div>
                </div>

                <div className="quick-actions">
                  <h3>Quick Actions</h3>
                  <div className="action-buttons">
                    <button onClick={() => setActiveTab('products')}>
                      📦 Manage Products
                    </button>
                    <button onClick={() => setActiveTab('orders')}>
                      📋 View Orders
                    </button>
                    <button onClick={() => setActiveTab('deliveries')}>
                      🚚 Track Deliveries
                    </button>
                  </div>
                </div>

                <div className="recent-activity">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <p>No recent activity yet</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <ProductManagement />
        )}

        {activeTab === 'orders' && (
          <div className="orders-tab">
            <h2>Order Management</h2>
            <div className="coming-soon">
              <h3>🛠️ Coming Soon</h3>
              <p>Order management system will be available in the next update.</p>
              <p>You'll be able to view, process, and track customer orders here.</p>
            </div>
          </div>
        )}

        {activeTab === 'deliveries' && (
          <div className="deliveries-tab">
            <h2>Delivery Tracking</h2>
            <div className="coming-soon">
              <h3>🛠️ Coming Soon</h3>
              <p>Delivery tracking system will be available in the next update.</p>
              <p>You'll be able to assign riders and track deliveries in real-time.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;