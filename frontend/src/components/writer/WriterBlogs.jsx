import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginContext';
import api from '../../utils/api';
import './WriterBlogs.css';

function WriterBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWriterBlogs();
  }, []);

  const fetchWriterBlogs = async () => {
    try {
      const response = await api.get(`/writerapi/writerblogs/${user._id}`);
      if (response.data.payload) {
        setBlogs(response.data.payload);
      }
    } catch (err) {
      console.error('Error fetching writer blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog._id);
    setEditFormData({
      title: blog.title,
      description: blog.description
    });
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
    setEditFormData({ title: '', description: '' });
  };

  const handleSaveEdit = async (blogId) => {
    try {
      await api.put(`/writerapi/updateblog/${blogId}`, editFormData);
      const updatedBlogs = blogs.map(blog =>
        blog._id === blogId
          ? { ...blog, ...editFormData }
          : blog
      );
      setBlogs(updatedBlogs);
      setEditingBlog(null);
      alert('Blog updated successfully!');
    } catch (err) {
      console.error('Error updating blog:', err);
      alert('Failed to update blog');
    }
  };

  const handleToggleDelete = async (blogId, currentStatus) => {
    try {
      await api.put(`/writerapi/hideblog/${blogId}`, { isDelete: !currentStatus });
      const updatedBlogs = blogs.map(blog =>
        blog._id === blogId
          ? { ...blog, isDelete: !currentStatus }
          : blog
      );
      setBlogs(updatedBlogs);
      alert(currentStatus ? 'Blog republished!' : 'Blog hidden!');
    } catch (err) {
      console.error('Error toggling blog visibility:', err);
      alert('Failed to update blog visibility');
    }
  };

  const handleViewBlog = (blogId) => {
    navigate(`/writer/${blogId}`);
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading your blogs...</p>
      </div>
    );
  }

  return (
    <div className="writer-blogs-page">
      <div className="writer-blogs-header fade-in">
        <div>
          <h1 className="page-title text-gradient">📄 My Blogs</h1>
          <p className="page-subtitle">
            Manage and edit your published content
          </p>
        </div>
        <button
          onClick={() => navigate('/writer/addpost')}
          className="btn btn-primary"
        >
          ✍️ Create New Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="no-blogs fade-in">
          <span className="no-blogs-icon">📝</span>
          <h3>You haven't created any blogs yet</h3>
          <p>Start writing and share your stories with the world!</p>
          <button
            onClick={() => navigate('/writer/addpost')}
            className="btn btn-primary"
          >
            Create Your First Blog
          </button>
        </div>
      ) : (
        <div className="writer-blogs-list">
          {blogs.map((blog, index) => (
            <div
              key={blog._id}
              className={`writer-blog-card scale-in ${blog.isDelete ? 'hidden-blog' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
          {editingBlog === blog._id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="input-field"
                    placeholder="Blog title"
                  />
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="textarea-field"
                    rows="6"
                    placeholder="Blog content"
                  />
                  <div className="edit-actions">
                    <button onClick={handleCancelEdit} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button onClick={() => handleSaveEdit(blog._id)} className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {blog.isDelete && <div className="hidden-badge">Hidden</div>}
                  
                  <div className="blog-content">
                    <h3 className="blog-title">{blog.title}</h3>
                    <p className="blog-description">
                      {blog.description.length > 200
                        ? `${blog.description.substring(0, 200)}...`
                        : blog.description}
                    </p>
                    <div className="blog-meta">
                      <div className="blog-stats">
                        <span>❤️ {blog.likesCount || 0}</span>
                        <span>💬 {blog.comments?.length || 0}</span>
                      </div>
                      <div className="blog-dates">
                        <span>Created: {blog.createdAt}</span>
                        {blog.updatedAt !== blog.createdAt && (
                          <span>Updated: {blog.updatedAt}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="blog-actions">
                    <button
                      onClick={() => handleViewBlog(blog._id)}
                      className="action-btn view-btn"
                      title="View blog"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleEdit(blog)}
                      className="action-btn edit-btn"
                      title="Edit blog"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleToggleDelete(blog._id, blog.isDelete)}
                      className={`action-btn ${blog.isDelete ? 'publish-btn' : 'delete-btn'}`}
                      title={blog.isDelete ? 'Republish blog' : 'Hide blog'}
                    >
                      {blog.isDelete ? '🔄' : '🗑️'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WriterBlogs;