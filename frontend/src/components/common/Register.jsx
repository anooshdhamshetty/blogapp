import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Auth.css';
import api from '../../utils/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    gmail: '',
    password: '',
    photo: 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff',
    role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roles = ['user', 'writer'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role: role
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.role) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/userapi/user', formData);
      
      if (res.data.message === 'user already exists') {
        setError('User with this email already exists');
      } else {
        // Registration successful, redirect to login
        navigate('/signin', { state: { message: 'Registration successful! Please login.' } });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            <h2 className="auth-title text-gradient">Create Account</h2>
            <p className="auth-subtitle">Join our community of writers and readers</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">
                <span className="label-icon">👤</span>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="input-field"
                required
              />
            </div>

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
                placeholder="Create a password"
                className="input-field"
                minLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <span className="label-icon">🎭</span>
                Select Your Role
              </label>
              <div className="role-bubbles">
                {roles.map((role) => (
                  <div
                    key={role}
                    className={`role-bubble ${formData.role === role ? 'selected' : ''}`}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <span className="role-icon">{role === 'writer' ? '✍️' : '📖'}</span>
                    <span className="role-name">{role}</span>
                    {formData.role === role && <span className="checkmark">✓</span>}
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/signin" className="auth-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
