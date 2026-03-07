import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginContext';
import { useTheme } from '../../contexts/ThemeContext';
import './Header.css';

function Header() {
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="nav-container">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <div className="logo-wrapper">
            <svg className="logo-svg" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <rect x="5" y="10" width="30" height="25" rx="3" fill="url(#logoGradient)" />
              <line x1="10" y1="18" x2="30" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="10" y1="23" x2="25" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="10" y1="28" x2="28" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="logo-text text-gradient">BlogHub</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {user ? (
            <>
              <Link
                to={role === 'writer' ? '/writer/totalblogspage' : '/user/totalblogspage'}
                className="nav-link"
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">📚</span>
                All Blogs
              </Link>
              <Link
                to={role === 'writer' ? '/writer/wishlist' : '/user/wishlist'}
                className="nav-link"
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">❤️</span>
                Wishlist
              </Link>
              {role === 'writer' && (
                <>
                  <Link to="/writer/addpost" className="nav-link" onClick={closeMobileMenu}>
                    <span className="nav-icon">✍️</span>
                    Create Post
                  </Link>
                  <Link to="/writer/writerblogs" className="nav-link" onClick={closeMobileMenu}>
                    <span className="nav-icon">📄</span>
                    My Blogs
                  </Link>
                </>
              )}
              <Link
                to={role === 'writer' ? '/writer/profile' : '/user/profile'}
                className="nav-link profile-link"
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">👤</span>
                Profile
              </Link>
              <div className="user-info">
                <img
                  src={user.photo || 'https://via.placeholder.com/40'}
                  alt={user.name}
                  className="user-avatar"
                />
                <span className="user-name">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link" onClick={closeMobileMenu}>
                Home
              </Link>
              <Link to="/signin" className="btn btn-primary" onClick={closeMobileMenu}>
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-secondary" onClick={closeMobileMenu}>
                Sign Up
              </Link>
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>
    </header>
  );
}

export default Header;