import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/LoginContext';
import api from '../../utils/api';
import './BlogPage.css';

function BlogPage() {
  const { blogpageid } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchBlogDetails();
  }, [blogpageid]);

  const fetchBlogDetails = async () => {
    try {
      const response = await api.get('/userapi/totalblogs');
      const foundBlog = response.data.payload?.find(b => b._id === blogpageid);
      if (foundBlog) {
        setBlog(foundBlog);
      } else {
        navigate(-1);
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || !user._id) {
      alert('Please login to like blogs');
      return;
    }
    
    try {
      const response = await api.put(`/userapi/updatelike/${blog._id}`, {
        userId: user._id
      });
      
      const { isLiked, likesCount, likedBy } = response.data;
      
      setBlog({
        ...blog,
        likesCount: likesCount,
        likedBy: likedBy
      });
    } catch (err) {
      console.error('Error updating like:', err);
      alert('Failed to update like');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingComment(true);
    try {
      const commentData = {
        name: user.name,
        photo: user.photo || 'https://via.placeholder.com/50',
        comment: comment
      };
      
      await api.put(`/userapi/usercomments/${blog._id}`, commentData);
      
      setBlog({
        ...blog,
        comments: [...(blog.comments || []), commentData]
      });
      setComment('');
      alert('Comment added successfully!');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await api.post(`/userapi/addtowishlist/${blog._id}`, { id: user._id });
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
        <p>Loading blog...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="error-page">
        <h2>Blog not found</h2>
        <button onClick={() => navigate(-1)} className="btn btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="blog-container fade-in">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back to Blogs
        </button>

        <article className="blog-article">
          <header className="blog-header">
            <h1 className="blog-title">{blog.title}</h1>
            <div className="blog-meta">
              <div className="author-section">
                <div className="author-avatar-large">
                  {blog.author.charAt(0).toUpperCase()}
                </div>
                <div className="author-details">
                  <span className="author-name">{blog.author}</span>
                  <span className="blog-date">Published on {blog.createdAt}</span>
                  {blog.updatedAt !== blog.createdAt && (
                    <span className="blog-date">Updated on {blog.updatedAt}</span>
                  )}
                </div>
              </div>

              <div className="blog-actions">
                <button 
                  onClick={handleLike} 
                  className={`action-btn like-action ${blog.likedBy?.includes(user?._id) ? 'liked' : ''}`}
                  title={blog.likedBy?.includes(user?._id) ? 'Remove Like' : 'Like this blog'}
                >
                  {blog.likedBy?.includes(user?._id) ? '🤍' : '❤️'} {blog.likesCount || 0}
                </button>
                <button onClick={handleAddToWishlist} className="action-btn wishlist-action">
                  🔖 Save
                </button>
              </div>
            </div>
          </header>

          <div className="blog-content">
            <p>{blog.description}</p>
          </div>
        </article>

        <section className="comments-section">
          <h2 className="section-title">
            💬 Comments ({blog.comments?.length || 0})
          </h2>

          <form onSubmit={handleSubmitComment} className="comment-form">
            <div className="user-avatar-small">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="comment-input-wrapper">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="comment-input"
                rows="3"
                required
              />
              <button
                type="submit"
                className="btn btn-primary submit-comment-btn"
                disabled={submittingComment}
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>

          <div className="comments-list">
            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map((c, index) => (
                <div key={index} className="comment-item scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <img
                    src={c.photo || 'https://via.placeholder.com/50'}
                    alt={c.name}
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{c.name}</span>
                    </div>
                    <p className="comment-text">{c.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-comments">
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default BlogPage;