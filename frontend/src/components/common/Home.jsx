import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/LoginContext";
import './Home.css';

function Home() {
  const { user, loading, role } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const handleGetStarted = () => {
    if (user) {
      if (role === 'writer') {
        navigate('/writer/totalblogspage');
      } else {
        navigate('/user/totalblogspage');
      }
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section fade-in">
        <div className="hero-content">
          <div className="hero-text slide-in-left">
            <h1 className="hero-title">
              Welcome to <span className="text-gradient">BlogHub</span>
            </h1>
            <p className="hero-subtitle">
              Your platform to share stories, ideas, and inspiration with the world
            </p>
            <p className="hero-description">
              {user
                ? `Welcome back, ${user.name}! Ready to explore more amazing content?`
                : 'Join our community of writers and readers today'}
            </p>
            <div className="hero-buttons">
              <button onClick={handleGetStarted} className="btn btn-primary btn-large">
                {user ? 'Explore Blogs' : 'Get Started'}
              </button>
              {!user && (
                <button onClick={() => navigate('/signin')} className="btn btn-secondary btn-large">
                  Sign In
                </button>
              )}
            </div>
          </div>
          <div className="hero-illustration slide-in-right">
            <div className="illustration-circle circle-1"></div>
            <div className="illustration-circle circle-2"></div>
            <div className="illustration-circle circle-3"></div>
            <div className="illustration-content">
              <span className="illustration-icon">📚</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title text-gradient">Why Choose BlogHub?</h2>
        <div className="features-grid">
          <div className="feature-card scale-in">
            <div className="feature-icon">✍️</div>
            <h3>Write & Share</h3>
            <p>Create beautiful blog posts with our intuitive editor and share your stories with the world</p>
          </div>
          <div className="feature-card scale-in" style={{animationDelay: '0.1s'}}>
            <div className="feature-icon">🔖</div>
            <h3>Save Favorites</h3>
            <p>Bookmark your favorite articles and access them anytime from your personalized wishlist</p>
          </div>
          <div className="feature-card scale-in" style={{animationDelay: '0.2s'}}>
            <div className="feature-icon">💬</div>
            <h3>Engage & Comment</h3>
            <p>Join the conversation by commenting and liking posts from writers around the globe</p>
          </div>
          <div className="feature-card scale-in" style={{animationDelay: '0.3s'}}>
            <div className="feature-icon">🌙</div>
            <h3>Dark Mode</h3>
            <p>Eye-friendly dark mode for comfortable reading at any time of day or night</p>
          </div>
          <div className="feature-card scale-in" style={{animationDelay: '0.4s'}}>
            <div className="feature-icon">📱</div>
            <h3>Responsive Design</h3>
            <p>Seamless experience across all devices - desktop, tablet, and mobile</p>
          </div>
          <div className="feature-card scale-in" style={{animationDelay: '0.5s'}}>
            <div className="feature-icon">⚡</div>
            <h3>Fast & Modern</h3>
            <p>Lightning-fast performance with beautiful animations and smooth transitions</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {!user && (
        <section className="stats-section fade-in">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number text-gradient">1000+</div>
              <div className="stat-label">Blog Posts</div>
            </div>
            <div className="stat-item">
              <div className="stat-number text-gradient">500+</div>
              <div className="stat-label">Writers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number text-gradient">10K+</div>
              <div className="stat-label">Readers</div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section scale-in">
        <h2>Ready to Start Your Journey?</h2>
        <p>Join thousands of writers and readers sharing their stories</p>
        <button onClick={handleGetStarted} className="btn btn-primary btn-large">
          {user ? 'Continue Reading' : 'Create Account'}
        </button>
      </section>
    </div>
  );
}

export default Home;


