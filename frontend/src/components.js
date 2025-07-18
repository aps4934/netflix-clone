import React, { useState, useEffect, useRef } from 'react';

// Netflix Logo Component
export const NetflixLogo = () => (
  <div className="netflix-logo">
    <span className="text-red-600 font-bold text-3xl">NETFLIX</span>
  </div>
);

// Header Component
export const Header = ({ onSearch, onProfileClick, currentProfile }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="header-left">
          <NetflixLogo />
          <nav className="nav-links">
            <a href="#home" className="nav-link active">Home</a>
            <a href="#series" className="nav-link">TV Shows</a>
            <a href="#movies" className="nav-link">Movies</a>
            <a href="#new" className="nav-link">New & Popular</a>
            <a href="#my-list" className="nav-link">My List</a>
          </nav>
        </div>
        
        <div className="header-right">
          <div className="search-container">
            <button 
              className="search-btn"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            {searchOpen && (
              <input 
                type="text"
                placeholder="Search movies..."
                className="search-input"
                onChange={(e) => onSearch(e.target.value)}
                autoFocus
              />
            )}
          </div>
          
          <div className="profile-container">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Profile"
              className="profile-avatar"
              onClick={onProfileClick}
            />
            <span className="profile-name">{currentProfile}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// Hero Section Component
export const Hero = ({ movie, onPlay }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  if (!movie) return null;

  const backgroundImage = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : 'https://images.unsplash.com/flagged/photo-1590183030142-efad5a97612f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxuZXRmbGl4fGVufDB8fHxibGFja3wxNzUyODI4Mjc4fDA&ixlib=rb-4.1.0&q=85';

  return (
    <div className="hero">
      <div className="hero-background">
        <img 
          src={backgroundImage}
          alt={movie.title}
          className={`hero-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <h1 className="hero-title">{movie.title}</h1>
        <p className="hero-description">{movie.overview}</p>
        
        <div className="hero-buttons">
          <button className="play-btn" onClick={onPlay}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
            </svg>
            Play
          </button>
          <button className="info-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

// Movie Card Component
export const MovieCard = ({ movie, onPlay }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const posterImage = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlcnxlbnwwfHx8YmxhY2t8MTc1MjgxNzYwNXww&ixlib=rb-4.1.0&q=85';

  const contentType = movie.content_type || 'movie';
  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

  return (
    <div 
      className={`movie-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={posterImage}
        alt={title}
        className={`movie-poster ${imageLoaded ? 'loaded' : ''}`}
        onLoad={() => setImageLoaded(true)}
      />
      
      {isHovered && (
        <div className="movie-card-overlay">
          <div className="movie-card-content">
            <h3 className="movie-card-title">{title}</h3>
            <div className="movie-card-info">
              <p className="movie-card-rating">⭐ {movie.vote_average?.toFixed(1)}</p>
              {year && <p className="movie-card-year">{year}</p>}
              <p className="movie-card-type">{contentType === 'tv' ? 'TV Series' : 'Movie'}</p>
            </div>
            <button 
              className="movie-card-play-btn"
              onClick={() => onPlay(movie)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
              </svg>
              Play
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Movie Row Component
export const MovieRow = ({ title, movies, onPlay }) => {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = 300;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  return (
    <div className="movie-row">
      <h2 className="movie-row-title">{title}</h2>
      
      <div className="movie-row-container">
        {showLeftArrow && (
          <button 
            className="movie-row-arrow left"
            onClick={() => scroll('left')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        )}
        
        <div 
          className="movie-row-scroll"
          ref={rowRef}
          onScroll={handleScroll}
        >
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id}
              movie={movie}
              onPlay={onPlay}
            />
          ))}
        </div>
        
        {showRightArrow && (
          <button 
            className="movie-row-arrow right"
            onClick={() => scroll('right')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Video Modal Component
export const VideoModal = ({ movie, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="video-modal-overlay" onClick={handleBackgroundClick}>
      <div className="video-modal">
        <div className="video-modal-header">
          <h2 className="video-modal-title">{movie.title}</h2>
          <button className="video-modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
        
        <div className="video-container">
          {isLoading && (
            <div className="video-loading">
              <div className="loading-spinner"></div>
              <p>Loading trailer...</p>
            </div>
          )}
          
          <iframe
            src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1&rel=0&modestbranding=1`}
            title={movie.title}
            className="video-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
        </div>
        
        <div className="video-modal-content">
          <p className="video-modal-description">{movie.overview}</p>
          <div className="video-modal-info">
            <span className="video-modal-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
            <span className="video-modal-date">Released: {movie.release_date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Search Results Component
export const SearchResults = ({ results, onPlay, searchQuery }) => {
  return (
    <div className="search-results">
      <h2 className="search-results-title">
        Search results for "{searchQuery}" ({results.length} results)
      </h2>
      
      <div className="search-results-grid">
        {results.map((movie) => (
          <MovieCard 
            key={movie.id}
            movie={movie}
            onPlay={onPlay}
          />
        ))}
      </div>
    </div>
  );
};

// Profile Selector Component
export const ProfileSelector = ({ onProfileSelect, onClose }) => {
  const profiles = [
    { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    { name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b85e4b6e?w=100&h=100&fit=crop&crop=face' },
    { name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    { name: 'Sarah Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  ];

  return (
    <div className="profile-selector">
      <div className="profile-selector-content">
        <h1 className="profile-selector-title">Who's watching?</h1>
        
        <div className="profiles-grid">
          {profiles.map((profile) => (
            <div 
              key={profile.name}
              className="profile-item"
              onClick={() => onProfileSelect(profile.name)}
            >
              <img 
                src={profile.avatar}
                alt={profile.name}
                className="profile-item-avatar"
              />
              <span className="profile-item-name">{profile.name}</span>
            </div>
          ))}
        </div>
        
        <button className="profile-selector-close" onClick={onClose}>
          Continue with current profile
        </button>
      </div>
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p className="loading-text">Loading Netflix...</p>
  </div>
);