import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Header, 
  Hero, 
  MovieRow, 
  VideoModal, 
  SearchResults,
  ProfileSelector,
  LoadingSpinner 
} from './components';

const TMDB_API_KEY = 'c8dea14dc917687ac631a52620e4f7ad';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function App() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [movieRows, setMovieRows] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [currentProfile, setCurrentProfile] = useState('John Doe');

  // Fetch data from TMDB API
  const fetchMovies = async (endpoint) => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`);
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
    }
  };

  const fetchTrailerKey = async (movieId) => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`);
      const data = await response.json();
      const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
      return trailer ? trailer.key : null;
    } catch (error) {
      console.error('Error fetching trailer:', error);
      return null;
    }
  };

  const searchMovies = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching movies:', error);
      setSearchResults([]);
    }
  };

  const handlePlayTrailer = async (movie) => {
    const trailerKey = await fetchTrailerKey(movie.id);
    if (trailerKey) {
      setSelectedVideo({ ...movie, trailerKey });
    } else {
      // Fallback to a sample trailer if no trailer found
      setSelectedVideo({ ...movie, trailerKey: 'dQw4w9WgXcQ' });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Fetch different categories
      const [popular, trending, topRated, upcoming, nowPlaying] = await Promise.all([
        fetchMovies('/movie/popular'),
        fetchMovies('/trending/movie/day'),
        fetchMovies('/movie/top_rated'),
        fetchMovies('/movie/upcoming'),
        fetchMovies('/movie/now_playing')
      ]);

      // Set featured movie (first from trending)
      if (trending.length > 0) {
        setFeaturedMovie(trending[0]);
      }

      // Create movie rows
      setMovieRows([
        { title: 'Trending Now', movies: trending },
        { title: 'Popular on Netflix', movies: popular },
        { title: 'Top Rated', movies: topRated },
        { title: 'New Releases', movies: upcoming },
        { title: 'Now Playing', movies: nowPlaying }
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // Handle search
  useEffect(() => {
    const debounce = setTimeout(() => {
      searchMovies(searchQuery);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      {showProfile ? (
        <ProfileSelector 
          onProfileSelect={(profile) => {
            setCurrentProfile(profile);
            setShowProfile(false);
          }}
          onClose={() => setShowProfile(false)}
        />
      ) : (
        <>
          <Header 
            onSearch={setSearchQuery}
            onProfileClick={() => setShowProfile(true)}
            currentProfile={currentProfile}
          />
          
          {searchQuery && searchResults.length > 0 ? (
            <SearchResults 
              results={searchResults}
              onPlay={handlePlayTrailer}
              searchQuery={searchQuery}
            />
          ) : (
            <>
              {featuredMovie && (
                <Hero 
                  movie={featuredMovie}
                  onPlay={() => handlePlayTrailer(featuredMovie)}
                />
              )}
              
              <div className="movie-rows">
                {movieRows.map((row, index) => (
                  <MovieRow 
                    key={index}
                    title={row.title}
                    movies={row.movies}
                    onPlay={handlePlayTrailer}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
      
      {selectedVideo && (
        <VideoModal 
          movie={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}

export default App;