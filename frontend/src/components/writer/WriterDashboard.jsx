import React from 'react';
import { useAuth } from '../../contexts/LoginContext';
import { useNavigate } from 'react-router-dom';
import './WriterDashboard.css';

function WriterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="page-title text-gradient">Writer Dashboard</h1>
          <p className="page-subtitle">Manage your profile and create amazing content</p>
        </div>

        <div className="profile-card">
          <div className="profile-banner">
            <div className="banner-gradient"></div>
          </div>
          
          <div className="profile-content">
            <div className="profile-avatar-section">
              <div className="profile-avatar-wrapper">
                <img 
                  src={user?.photo || 'https://ui-avatars.com/api/?name=Writer&background=8b5cf6&color=fff'} 
                  alt={user?.name}
                  className="profile-avatar-large"
                />
              </div>
              <div className="profile-info-section">
                <h2 className="profile-name">{user?.name}</h2>
                <p className="profile-email">{user?.gmail}</p>
                <span className="profile-role-badge">✍️ {user?.role}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary edit-profile-btn"
              onClick={() => navigate('/writer/edit-profile')}
            >
              ✏️ Edit Profile
            </button>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <span className="stat-icon">📝</span>
              <div className="stat-info">
                <span className="stat-label">Role</span>
                <span className="stat-value">Content Creator</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📖</span>
              <div className="stat-info">
                <span className="stat-label">Status</span>
                <span className="stat-value">Active Writer</span>
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
                onClick={() => navigate('/writer/addpost')}
              >
                <span className="action-icon">✍️</span>
                <span className="action-label">Create Blog</span>
              </button>
              <button 
                className="action-card"
                onClick={() => navigate('/writer/writerblogs')}
              >
                <span className="action-icon">📚</span>
                <span className="action-label">My Blogs</span>
              </button>
              <button 
                className="action-card"
                onClick={() => navigate('/writer/totalblogspage')}
              >
                <span className="action-icon">📰</span>
                <span className="action-label">Browse Blogs</span>
              </button>
              <button 
                className="action-card"
                onClick={() => navigate('/writer/wishlist')}
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

export default WriterDashboard;
