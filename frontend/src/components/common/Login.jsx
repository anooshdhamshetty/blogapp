import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginContext';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({
    gmail: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    
    try {
      const res = await api.post('/userapi/login', formData);
      
      if (res.data.message === 'Invalid username' || res.data.message === 'Invalid password') {
        setError(res.data.message);
      } else if (res.data.message === 'login success') {
        // Store user data in context and localStorage
        login(res.data.user, res.data.token, res.data.role);
        
        // Redirect based on role
        if (res.data.role === 'user') {
          navigate('/user/totalblogspage');
        } else if (res.data.role === 'writer') {
          navigate('/writer/totalblogspage');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container fade-in">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-section">
              <span className="logo-icon">📝</span>
            </div>
            <h2 className="auth-title text-gradient">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to continue your journey</p>
          </div>

          {successMessage && <div className="success-message">{successMessage}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="gmail">
                <span className="label-icon">✉️</span>
                Email Address
              </label>
              <input
                type="email"
                id="gmail"
                name="gmail"
                value={formData.gmail}
                onChange={handleChange}
                placeholder="Enter your email"
                className="input-field"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔒</span>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input-field"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
