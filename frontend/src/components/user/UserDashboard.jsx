import React from 'react';
import { useAuth } from '../../contexts/LoginContext';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="page-title text-gradient">My Profile</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>

        <div className="profile-card">
          <div className="profile-banner">
            <div className="banner-gradient"></div>
          </div>
          
          <div className="profile-content">
            <div className="profile-avatar-section">
              <div className="profile-avatar-wrapper">
                <img 
                  src={user?.photo || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'} 
                  alt={user?.name}
                  className="profile-avatar-large"
                />
              </div>
              <div className="profile-info-section">
                <h2 className="profile-name">{user?.name}</h2>
                <p className="profile-email">{user?.gmail}</p>
                <span className="profile-role-badge">{user?.role}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary edit-profile-btn"
              onClick={() => navigate('/user/edit-profile')}
            >
              ✏️ Edit Profile
            </button>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <span className="stat-icon">📖</span>
              <div className="stat-info">
                <span className="stat-label">Role</span>
                <span className="stat-value">{user?.role === 'user' ? 'Reader' : 'Writer'}</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📚</span>
              <div className="stat-info">
                <span className="stat-label">Interests</span>
                <span className="stat-value">Blog Reader</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🔖</span>
              <div className="stat-info">
                <span className="stat-label">Saved</span>
                <span className="stat-value">{user?.addToWhishList?.length || 0} Blogs</span>
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <h3 className="section-title">Quick Actions</h3>
            <div className="action-buttons">
              <button 
                className="action-card"
                onClick={() => navigate('/user/totalblogspage')}
              >
                <span className="action-icon">📰</span>
                <span className="action-label">Browse Blogs</span>
              </button>
              <button 
                className="action-card"
                onClick={() => navigate('/user/wishlist')}
              >
                <span className="action-icon">❤️</span>
                <span className="action-label">My Wishlist</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
