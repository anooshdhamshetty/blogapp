import React, { useState } from 'react';
import { useAuth } from '../../contexts/LoginContext';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './EditProfile.css';

function EditProfile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    gmail: user?.gmail || '',
    password: '',
    photo: user?.photo || ''
  });
  const [preview, setPreview] = useState(user?.photo || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 2MB' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreview(base64String);
        setFormData({
          ...formData,
          photo: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Only send password if it's been changed
      const updateData = {
        name: formData.name,
        gmail: formData.gmail,
        photo: formData.photo
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await api.put('/userapi/userupdate', updateData);
      
      if (response.data.message === 'User updated successfully') {
        // Update local user data with the returned payload
        const updatedUser = { 
          ...user, 
          name: response.data.payload.name,
          photo: response.data.payload.photo,
          gmail: response.data.payload.gmail
        };
        updateUser(updatedUser);
        
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => {
          navigate(user.role === 'writer' ? '/writer/profile' : '/user/profile');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <div className="profile-header">
          <h1 className="page-title text-gradient">Edit Profile</h1>
          <p className="page-subtitle">Update your personal information</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="profile-photo-section">
            <div className="photo-preview">
              <img src={preview} alt="Profile preview" />
            </div>
            <div className="photo-upload-btn">
              <label htmlFor="photoUpload" className="btn btn-secondary">
                📷 Upload Photo
              </label>
              <input
                type="file"
                id="photoUpload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <p className="upload-hint">Max size: 2MB</p>
            </div>
          </div>

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
              className="input-field"
              disabled
              title="Email cannot be changed"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <span className="label-icon">🔒</span>
              New Password (Leave blank to keep current)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="input-field"
              minLength="6"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
