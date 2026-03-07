import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginContext';
import api from '../../utils/api';
import './TotalBlogsPage.css';

function TotalBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchTerm, blogs]);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/userapi/totalblogs');
      if (response.data.payload) {
        setBlogs(response.data.payload);
        setFilteredBlogs(response.data.payload);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = (blogId) => {
    if (role === 'writer') {
      navigate(`/writer/${blogId}`);
    } else {
      navigate(`/user/${blogId}`);
    }
  };

  const handleLike = async (e, blog) => {
    e.stopPropagation();
    if (!user || !user._id) {
      alert('Please login to like blogs');
      return;
    }
    
    try {
      const response = await api.put(`/userapi/updatelike/${blog._id}`, {
        userId: user._id
      });
      
      const { isLiked, likesCount, likedBy } = response.data;
      
      const updatedBlogs = blogs.map(b => {
        if (b._id === blog._id) {
          return {
            ...b,
            likesCount: likesCount,
            likedBy: likedBy
          };
        }
        return b;
      });
      setBlogs(updatedBlogs);
    } catch (err) {
      console.error('Error updating like:', err);
      alert('Failed to update like');
    }
  };

  const handleAddToWishlist = async (e, blogId) => {
    e.stopPropagation();
    try {
      await api.post(`/userapi/addtowishlist/${blogId}`, { id: user._id });
      alert('Blog added to wishlist!');
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      alert('Failed to add to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading amazing blogs...</p>
      </div>
    );
  }

  return (
    <div className="total-blogs-page">
      <div className="blogs-header fade-in">
        <div className="header-content">
          <h1 className="page-title text-gradient">Discover Amazing Stories</h1>
          <p className="page-subtitle">Explore blogs from talented writers around the world</p>
        </div>
        
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search blogs by title, author, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {filteredBlogs.length === 0 ? (
        <div className="no-blogs fade-in">
          <span className="no-blogs-icon">📭</span>
          <h3>No blogs found</h3>
          <p>{searchTerm ? 'Try different search terms' : 'Be the first to create a blog!'}</p>
        </div>
      ) : (
        <>
          <div className="blogs-stats">
            <p>Showing {filteredBlogs.length} of {blogs.length} blogs</p>
          </div>
          
          <div className="blogs-grid">
            {filteredBlogs.map((blog, index) => (
              <div
                key={blog._id}
                className="blog-card scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleBlogClick(blog._id)}
              >
                <div className="blog-card-header">
                  <div className="blog-author">
                    <div className="author-avatar">
                      {blog.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="author-info">
                      <span className="author-name">{blog.author}</span>
                      <span className="blog-date">{blog.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="blog-card-body">
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-description">
                    {blog.description.length > 150
                      ? `${blog.description.substring(0, 150)}...`
                      : blog.description}
                  </p>
                </div>

                <div className="blog-card-footer">
                  <div className="blog-stats">
                    <button
                      className={`stat-btn like-btn ${blog.likedBy?.includes(user?._id) ? 'liked' : ''}`}
                      onClick={(e) => handleLike(e, blog)}
                      title={blog.likedBy?.includes(user?._id) ? 'Remove Like' : 'Like this blog'}
                    >
                      <span className="stat-icon">{blog.likedBy?.includes(user?._id) ? '🤍' : '❤️'}</span>
                      <span>{blog.likesCount || 0}</span>
                    </button>
                    <div className="stat-item">
                      <span className="stat-icon">💬</span>
                      <span>{blog.comments?.length || 0}</span>
                    </div>
                  </div>
                  
                  <button
                    className="wishlist-btn"
                    onClick={(e) => handleAddToWishlist(e, blog._id)}
                    title="Add to wishlist"
                  >
                    🔖
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TotalBlogsPage;