import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginContext';
import api from '../../utils/api';
import './AddPost.css';

function AddPost() {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const blogData = {
        title: formData.title,
        description: formData.description,
        author: user.name,
        authorId: user._id,
        role: role
      };

      const response = await api.post('/writerapi/postblog', blogData);
      
      if (response.data.message === 'Post added succesfully') {
        alert('Blog published successfully!');
        navigate('/writer/writerblogs');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error creating blog:', err);
      setError('Failed to create blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-post-page">
      <div className="add-post-container fade-in">
        <div className="post-header">
          <h1 className="page-title text-gradient">✍️ Create New Blog</h1>
          <p className="page-subtitle">Share your thoughts and stories with the world</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title">
              <span className="label-icon">📝</span>
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a captivating title..."
              className="input-field"
              required
            />
            <small className="input-hint">{formData.title.length} characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              <span className="label-icon">📄</span>
              Blog Content
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              className="textarea-field"
              rows="15"
              required
            />
            <small className="input-hint">{formData.description.length} characters</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/writer/writerblogs')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Publishing...' : '🚀 Publish Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPost;