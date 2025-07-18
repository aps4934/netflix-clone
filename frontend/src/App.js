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
  const [apiError, setApiError] = useState(false);

  // Fetch data from TMDB API
  const fetchMovies = async (endpoint) => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching movies:', error);
      setApiError(true);
      return [];
    }
  };

  const fetchTVShows = async (endpoint) => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching TV shows:', error);
      setApiError(true);
      return [];
    }
  };

  const fetchTrailerKey = async (id, type = 'movie') => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/${type}/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const trailer = data.results?.find(video => video.type === 'Trailer' && video.site === 'YouTube');
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

  // Use mock data immediately to avoid loading issues
  useEffect(() => {
    setLoading(true);
    
    // Set mock data immediately
    const setupMockData = () => {
      setFeaturedMovie(mockMovies[0]);
      setMovieRows([
        { title: 'Trending Now', movies: mockMovies.slice(0, 5) },
        { title: 'Popular on Netflix', movies: mockMovies.slice(1, 6) },
        { title: 'Top Rated', movies: mockMovies.slice(2, 7) },
        { title: 'New Releases', movies: mockMovies.slice(3, 8) },
        { title: 'Now Playing', movies: mockMovies.slice(4, 9) }
      ]);
      setLoading(false);
    };

    // Try to fetch real data, but fallback to mock data quickly
    const loadData = async () => {
      try {
        // Short timeout to fail fast
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API timeout')), 2000)
        );
        
        const apiPromise = Promise.all([
          fetchMovies('/movie/popular'),
          fetchMovies('/trending/movie/day'),
          fetchMovies('/movie/top_rated'),
          fetchMovies('/movie/upcoming'),
          fetchMovies('/movie/now_playing')
        ]);

        const [popular, trending, topRated, upcoming, nowPlaying] = await Promise.race([
          apiPromise,
          timeoutPromise
        ]);

        // If we get here, API worked
        if (trending.length > 0) {
          setFeaturedMovie(trending[0]);
          setMovieRows([
            { title: 'Trending Now', movies: trending },
            { title: 'Popular on Netflix', movies: popular },
            { title: 'Top Rated', movies: topRated },
            { title: 'New Releases', movies: upcoming },
            { title: 'Now Playing', movies: nowPlaying }
          ]);
        } else {
          setupMockData();
        }
      } catch (error) {
        console.log('API failed, using mock data:', error.message);
        setupMockData();
      }
    };

    // Start with mock data immediately, then try API
    setupMockData();
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