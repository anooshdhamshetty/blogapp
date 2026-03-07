import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginContext';
import api from '../../utils/api';
import './AddToWishlist.css';

function AddToWishlist() {
  const [wishlistBlogs, setWishlistBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.get(`/userapi/getaddtowishlist/${user._id}`);
      if (response.data.payload) {
        setWishlistBlogs(response.data.payload);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (blogId) => {
    try {
      await api.put(`/userapi/removefromwishlist/${blogId}`, { id: user._id });
      setWishlistBlogs(wishlistBlogs.filter(blog => blog._id !== blogId));
      alert('Blog removed from wishlist!');
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('Failed to remove from wishlist');
    }
  };

  const handleBlogClick = (blogId) => {
    if (role === 'writer') {
      navigate(`/writer/${blogId}`);
    } else {
      navigate(`/user/${blogId}`);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header fade-in">
        <h1 className="page-title text-gradient">❤️ Your Wishlist</h1>
        <p className="page-subtitle">
          {wishlistBlogs.length > 0
            ? `You have ${wishlistBlogs.length} saved ${wishlistBlogs.length === 1 ? 'blog' : 'blogs'}`
            : 'Start saving your favorite blogs'}
        </p>
      </div>

      {wishlistBlogs.length === 0 ? (
        <div className="empty-wishlist fade-in">
          <span className="empty-icon">📭</span>
          <h3>Your wishlist is empty</h3>
          <p>Start exploring blogs and save the ones you love!</p>
          <button
            onClick={() => navigate(role === 'writer' ? '/writer/totalblogspage' : '/user/totalblogspage')}
            className="btn btn-primary"
          >
            Explore Blogs
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistBlogs.map((blog, index) => (
            <div
              key={blog._id}
              className="wishlist-card scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="wishlist-card-content" onClick={() => handleBlogClick(blog._id)}>
                <div className="blog-author">
                  <div className="author-avatar">
                    {blog.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="author-info">
                    <span className="author-name">{blog.author}</span>
                    <span className="blog-date">{blog.createdAt}</span>
                  </div>
                </div>

                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-description">
                  {blog.description.length > 120
                    ? `${blog.description.substring(0, 120)}...`
                    : blog.description}
                </p>

                <div className="blog-stats">
                  <div className="stat-item">
                    <span className="stat-icon">❤️</span>
                    <span>{blog.likesCount || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">💬</span>
                    <span>{blog.comments?.length || 0}</span>
                  </div>
                </div>
              </div>

              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromWishlist(blog._id);
                }}
                title="Remove from wishlist"
              >
                Remove ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddToWishlist;