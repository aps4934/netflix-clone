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

  const searchContent = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const [movieResults, tvResults] = await Promise.all([
        fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`),
        fetch(`${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`)
      ]);
      
      const movieData = await movieResults.json();
      const tvData = await tvResults.json();
      
      // Combine and mark content type
      const movies = (movieData.results || []).map(item => ({ ...item, content_type: 'movie' }));
      const tvShows = (tvData.results || []).map(item => ({ 
        ...item, 
        content_type: 'tv',
        title: item.name, // TV shows use 'name' instead of 'title'
        release_date: item.first_air_date
      }));
      
      setSearchResults([...movies, ...tvShows].slice(0, 20));
    } catch (error) {
      console.error('Error searching content:', error);
      setSearchResults([]);
    }
  };

  const handlePlayTrailer = async (item) => {
    const contentType = item.content_type || 'movie';
    const trailerKey = await fetchTrailerKey(item.id, contentType);
    
    if (trailerKey) {
      setSelectedVideo({ ...item, trailerKey, content_type: contentType });
    } else {
      // Fallback to a popular movie trailer
      setSelectedVideo({ ...item, trailerKey: 'dQw4w9WgXcQ', content_type: contentType });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setApiError(false);
      
      try {
        // Fetch both movies and TV shows
        const [
          popularMovies,
          trendingMovies,
          topRatedMovies,
          upcomingMovies,
          popularTVShows,
          trendingTVShows,
          topRatedTVShows,
          netflixOriginals
        ] = await Promise.all([
          fetchMovies('/movie/popular'),
          fetchMovies('/trending/movie/day'),
          fetchMovies('/movie/top_rated'),
          fetchMovies('/movie/upcoming'),
          fetchTVShows('/tv/popular'),
          fetchTVShows('/trending/tv/day'),
          fetchTVShows('/tv/top_rated'),
          fetchTVShows('/discover/tv?with_networks=213') // Netflix originals
        ]);

        // Process TV shows to have consistent structure
        const processedTVShows = (shows) => shows.map(show => ({
          ...show,
          title: show.name,
          release_date: show.first_air_date,
          content_type: 'tv'
        }));

        const processedMovies = (movies) => movies.map(movie => ({
          ...movie,
          content_type: 'movie'
        }));

        // Set featured content (priority: Netflix originals, then trending)
        const featuredContent = netflixOriginals.length > 0 ? netflixOriginals[0] : 
                               trendingMovies.length > 0 ? trendingMovies[0] : 
                               popularMovies.length > 0 ? popularMovies[0] : null;

        if (featuredContent) {
          setFeaturedMovie({
            ...featuredContent,
            title: featuredContent.title || featuredContent.name,
            content_type: featuredContent.original_name ? 'tv' : 'movie'
          });
        }

        // Create movie rows with mixed content
        const rows = [];
        
        if (netflixOriginals.length > 0) {
          rows.push({ 
            title: 'Netflix Originals', 
            movies: processedTVShows(netflixOriginals) 
          });
        }
        
        if (trendingMovies.length > 0) {
          rows.push({ 
            title: 'Trending Now', 
            movies: processedMovies(trendingMovies) 
          });
        }
        
        if (popularMovies.length > 0) {
          rows.push({ 
            title: 'Popular Movies', 
            movies: processedMovies(popularMovies) 
          });
        }
        
        if (popularTVShows.length > 0) {
          rows.push({ 
            title: 'Popular TV Shows', 
            movies: processedTVShows(popularTVShows) 
          });
        }
        
        if (topRatedMovies.length > 0) {
          rows.push({ 
            title: 'Top Rated Movies', 
            movies: processedMovies(topRatedMovies) 
          });
        }
        
        if (trendingTVShows.length > 0) {
          rows.push({ 
            title: 'Trending TV Shows', 
            movies: processedTVShows(trendingTVShows) 
          });
        }
        
        if (upcomingMovies.length > 0) {
          rows.push({ 
            title: 'Coming Soon', 
            movies: processedMovies(upcomingMovies) 
          });
        }
        
        if (topRatedTVShows.length > 0) {
          rows.push({ 
            title: 'Top Rated TV Shows', 
            movies: processedTVShows(topRatedTVShows) 
          });
        }

        setMovieRows(rows);
        
      } catch (error) {
        console.error('Error loading data:', error);
        setApiError(true);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.trim()) {
        searchContent(searchQuery);
      }
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