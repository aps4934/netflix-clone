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

// Mock data for fallback when API is not available
const mockMovies = [
  {
    id: 1,
    title: "The Dark Knight",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster_path: null,
    backdrop_path: null,
    vote_average: 9.0,
    release_date: "2008-07-18"
  },
  {
    id: 2,
    title: "Inception",
    overview: "A thief who enters the dreams of others to steal secrets from their subconscious is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster_path: null,
    backdrop_path: null,
    vote_average: 8.8,
    release_date: "2010-07-16"
  },
  {
    id: 3,
    title: "The Matrix",
    overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    poster_path: null,
    backdrop_path: null,
    vote_average: 8.7,
    release_date: "1999-03-31"
  },
  {
    id: 4,
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster_path: null,
    backdrop_path: null,
    vote_average: 8.6,
    release_date: "2014-11-07"
  },
  {
    id: 5,
    title: "Pulp Fiction",
    overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster_path: null,
    backdrop_path: null,
    vote_average: 8.9,
    release_date: "1994-10-14"
  },
  {
    id: 6,
    title: "The Godfather",
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster_path: null,
    backdrop_path: null,
    vote_average: 9.2,
    release_date: "1972-03-24"
  },
  {
    id: 7,
    title: "Forrest Gump",
    overview: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    poster_path: null,
    backdrop_path: null,
    vote_average: 8.8,
    release_date: "1994-07-06"
  },
  {
    id: 8,
    title: "The Shawshank Redemption",
    overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster_path: null,
    backdrop_path: null,
    vote_average: 9.3,
    release_date: "1994-09-23"
  },
  {
    id: 9,
    title: "Goodfellas",
    overview: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.",
    poster_path: null,
    backdrop_path: null,
    vote_average: 8.7,
    release_date: "1990-09-21"
  },
  {
    id: 10,
    title: "The Silence of the Lambs",
    overview: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.",
    poster_path: null,
    backdrop_path: null,
    vote_average: 8.6,
    release_date: "1991-02-14"
  }
];

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