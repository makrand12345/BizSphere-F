import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/auth';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('bizsphere_token');
      
      console.log('🔄 Loading admin data sequentially...');
      
      // Load businesses first (most important)
      console.log('📦 Loading businesses...');
      const businessesRes = await api.get('/admin/businesses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBusinesses(businessesRes.data);
      console.log('✅ Businesses loaded:', businessesRes.data.length);
      
      // Then load stats
      console.log('📊 Loading stats...');
      const statsRes = await api.get('/admin/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);
      console.log('✅ Stats loaded');
      
      // Load users last (least important)
      console.log('👥 Loading users...');
      const usersRes = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersRes.data);
      console.log('✅ Users loaded:', usersRes.data.length);
      
      console.log('🎉 All admin data loaded!');
      
    } catch (error) {
      console.error('❌ Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyBusiness = async (businessId, status, notes = '') => {
    try {
      const token = localStorage.getItem('bizsphere_token');
      await api.put(`/admin/verify-business/${businessId}`, 
        { status, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchDashboardData(); // Refresh data
      alert(`Business ${status} successfully!`);
    } catch (error) {
      alert('Failed to verify business: ' + error.response?.data?.message);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading Admin Dashboard...</p>
        <small>This may take a few seconds</small>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="nav-content">
          <h1>BizSphere Admin</h1>
          <div className="nav-actions">
            <span>Super Admin</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={activeTab === 'businesses' ? 'active' : ''}
          onClick={() => setActiveTab('businesses')}
        >
          🏢 Business Verification ({businesses.filter(b => b.verificationStatus === 'pending').length})
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 All Users ({users.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && stats && (
          <div className="dashboard-tab">
            <h2>Admin Dashboard Overview</h2>
            
            <div className="stats-grid">
              <div className="stat-card total-businesses">
                <h3>Total Businesses</h3>
                <div className="stat-number">{stats.totalBusinesses}</div>
                <div className="stat-subtitle">Registered on platform</div>
              </div>
              
              <div className="stat-card pending-verifications">
                <h3>Pending Verifications</h3>
                <div className="stat-number">{stats.pendingVerifications}</div>
                <div className="stat-subtitle">Awaiting approval</div>
              </div>
              
              <div className="stat-card total-customers">
                <h3>Total Customers</h3>
                <div className="stat-number">{stats.totalCustomers}</div>
                <div className="stat-subtitle">Registered users</div>
              </div>
              
              <div className="stat-card total-riders">
                <h3>Delivery Riders</h3>
                <div className="stat-number">{stats.totalRiders}</div>
                <div className="stat-subtitle">Active riders</div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button onClick={() => setActiveTab('businesses')}>
                  Review Pending Businesses ({stats.pendingVerifications})
                </button>
                <button onClick={() => setActiveTab('users')}>
                  View All Users ({stats.totalBusinesses + stats.totalCustomers + stats.totalRiders})
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'businesses' && (
          <div className="businesses-tab">
            <h2>Business Verification</h2>
            <div className="tab-info">
              <p>Found {businesses.length} businesses in the system</p>
            </div>
            <div className="businesses-list">
              {businesses.map(business => (
                <div key={business._id} className="business-card">
                  <div className="business-info">
                    <h3>{business.businessName}</h3>
                    <p><strong>Owner:</strong> {business.name}</p>
                    <p><strong>Email:</strong> {business.email}</p>
                    <p><strong>Phone:</strong> {business.phone}</p>
                    <p><strong>Registered:</strong> {new Date(business.createdAt).toLocaleDateString()}</p>
                    <div className={`status-badge ${business.verificationStatus}`}>
                      {business.verificationStatus}
                    </div>
                  </div>
                  
                  {business.verificationStatus === 'pending' && (
                    <div className="verification-actions">
                      <button 
                        onClick={() => verifyBusiness(business._id, 'approved')}
                        className="approve-btn"
                      >
                        ✅ Approve
                      </button>
                      <button 
                        onClick={() => {
                          const notes = prompt('Reason for rejection:');
                          if (notes) verifyBusiness(business._id, 'rejected', notes);
                        }}
                        className="reject-btn"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {businesses.length === 0 && (
                <div className="empty-state">
                  <p>No businesses registered yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <h2>All Users</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Business</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.businessName || '-'}</td>
                      <td>
                        {user.role === 'owner' ? (
                          <span className={`status-badge ${user.verificationStatus}`}>
                            {user.verificationStatus}
                          </span>
                        ) : (
                          <span className="status-badge approved">Active</span>
                        )}
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;