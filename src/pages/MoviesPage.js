import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaExclamationCircle, FaHeart, FaStar, FaFire, FaClock, FaArrowLeft } from 'react-icons/fa';
import { auth, db } from '../services/firebase';
import { doc, getDoc, updateDoc, setDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import MediaCard from '../components/MediaCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SORT_OPTIONS = [
  { label: 'Popular', value: 'popularity.desc', icon: <FaFire className="text-lg" /> },
  { label: 'Rating', value: 'vote_average.desc', icon: <FaStar className="text-lg" /> },
  { label: 'Latest', value: 'release_date.desc', icon: <FaClock className="text-lg" /> },
];

const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const MovieSkeleton = () => (
  <div className="bg-zinc-900/90 rounded-xl overflow-hidden animate-pulse">
    <div className="aspect-video bg-zinc-800"></div>
    <div className="p-4">
      <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
    </div>
  </div>
);

const MoviesPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Load user favorites from Firebase - optimized version
  useEffect(() => {
    let isMounted = true;
    const loadUserFavorites = async () => {
      if (!user) {
        setFavorites([]);
        setFavoritesLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const cachedFavorites = localStorage.getItem(`favorites_${user.uid}`);
        
        // First load cached favorites if available
        if (cachedFavorites) {
          const parsed = JSON.parse(cachedFavorites);
          if (isMounted) {
            setFavorites(parsed);
            if (showFavorites) {
              setMovies(parsed);
            }
          }
        }

        // Then fetch latest from Firebase
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          await setDoc(userRef, { favoriteMovies: [] });
          if (isMounted) {
            setFavorites([]);
            localStorage.setItem(`favorites_${user.uid}`, JSON.stringify([]));
          }
        } else {
          const favorites = userDoc.data()?.favoriteMovies || [];
          if (isMounted) {
            setFavorites(favorites);
            localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(favorites));
            if (showFavorites) {
              setMovies(favorites);
            }
          }
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
        if (isMounted) {
          setError('Failed to load favorites');
        }
      } finally {
        if (isMounted) {
          setFavoritesLoading(false);
        }
      }
    };

    loadUserFavorites();
    return () => {
      isMounted = false;
    };
  }, [user, showFavorites]);

  const toggleFavorite = async (movie) => {
    if (!user) {
      setError('Please log in to save favorites');
      return;
    }

    try {
      const movieData = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        overview: movie.overview
      };

      // Optimistic update
      const isCurrentlyFavorite = favorites.some(fav => fav.id === movie.id);
      const newFavorites = isCurrentlyFavorite
        ? favorites.filter(fav => fav.id !== movie.id)
        : [...favorites, movieData];

      // Update local state immediately
      setFavorites(newFavorites);
      localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(newFavorites));

      // Update UI immediately if in favorites view
      if (showFavorites) {
        setMovies(newFavorites);
      }

      // Update Firestore in background
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        favoriteMovies: newFavorites
      });

    } catch (err) {
      console.error('Error updating favorites:', err);
      setError('Failed to update favorites');
      
      // Revert changes on error
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const serverFavorites = userDoc.data()?.favoriteMovies || [];
      setFavorites(serverFavorites);
      localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(serverFavorites));
      if (showFavorites) {
        setMovies(serverFavorites);
      }
    }
  };

  const toggleGenre = (genreId) => {
    setSelectedGenres(prev => {
      const isSelected = prev.includes(genreId);
      const newGenres = isSelected
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId];
      setPage(1);
      return newGenres;
    });
  };

  const fetchMovies = async (searchQuery = '') => {
    try {
      setLoading(true);
      setError(null);

      const headers = {
        'Authorization': `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`,
        'accept': 'application/json'
      };

      const baseURL = 'https://api.themoviedb.org/3';
      let endpoint = searchQuery 
        ? '/search/movie'
        : '/discover/movie';

      const params = new URLSearchParams({
        page: page.toString(),
        language: 'en-US',
        include_adult: 'false',
        region: 'US',
        'vote_count.gte': '100',
        ...(searchQuery ? { query: searchQuery } : { 
          sort_by: sortBy,
          'vote_average.gte': '6'
        }),
        ...(selectedGenres.length > 0 ? { with_genres: selectedGenres.join(',') } : {})
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${baseURL}${endpoint}?${params}`, {
        method: 'GET',
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.status_message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.results) {
        throw new Error('Invalid response format from TMDB API');
      }

      const moviesWithImages = data.results.filter(movie => movie.poster_path);

      if (page === 1) {
        setMovies(moviesWithImages);
      } else {
        setMovies(prev => [...prev, ...moviesWithImages]);
      }
      setHasMore((data.total_pages || 0) > page);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        console.error('Error fetching movies:', err);
        setError(err.message || 'Failed to fetch movies. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add initial data fetching effect with cleanup
  useEffect(() => {
    let isMounted = true;
    
    const fetchInitialData = async () => {
      if (!showFavorites) {
        await fetchMovies();
      } else if (showFavorites && !favoritesLoading) {
        setMovies(favorites);
      }
    };

    if (isMounted) {
      fetchInitialData();
    }

    return () => {
      isMounted = false;
    };
  }, [sortBy, selectedGenres, showFavorites, favorites, favoritesLoading]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMovies(searchQuery);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
  };

  const handleShowFavorites = () => {
    setShowFavorites(prev => !prev);
    if (!showFavorites) {
      setMovies(favorites);
    } else {
      fetchMovies(searchQuery);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] relative overflow-x-hidden">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/50 backdrop-blur-sm text-zinc-100 hover:bg-zinc-800/90 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        <FaArrowLeft className="text-lg" />
        <span className="font-medium">Back</span>
      </button>

      {/* Main Background Elements */}
      <div className="fixed inset-0 z-0">
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(50,50,50,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(50,50,50,0.15)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]"></div>
        
        {/* Gradient Spotlight Effects */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-purple-900/20 via-fuchsia-900/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-teal-900/20 via-emerald-900/20 to-transparent"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-900/20 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-fuchsia-900/20 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-emerald-900/20 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob animation-delay-6000"></div>

        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj4NCjxmaWx0ZXIgaWQ9ImEiIHg9IjAiIHk9IjAiPg0KPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPg0KPC9maWx0ZXI+DQo8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIwLjA1Ii8+DQo8L3N2Zz4=')] opacity-20"></div>
      </div>

      {/* Header Section */}
      <div className="absolute top-0 left-0 right-0 z-50">
        {/* Glass Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/95 via-zinc-900/95 to-transparent backdrop-blur-xl"></div>
        
        {/* Content */}
        <div className="relative">
          {/* Title */}
          <div className="pt-8">
            <div className="container mx-auto max-w-6xl px-4">
              <h1 className="text-5xl md:text-7xl font-bold text-center mb-2">
                <span className="text-zinc-100">Movie</span>
                <span className="bg-gradient-to-r from-red-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">Hub</span>
              </h1>
              <p className="text-zinc-400 text-center text-lg">Discover your next favorite movie</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="container mx-auto max-w-6xl px-4 mt-8">
            <div className="max-w-2xl mx-auto">
              <div className={`relative transition-all duration-300 group ${
                isSearchFocused ? 'transform scale-[1.02]' : ''
              }`}>
                {/* Gradient Border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 via-purple-500 to-teal-500 rounded-xl opacity-75 blur group-hover:opacity-100 transition duration-300"></div>
                
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Discover movies..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-900/90 border-0 focus:outline-none focus:ring-0 text-zinc-100 placeholder-zinc-500 shadow-xl backdrop-blur-sm transition-all duration-300"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl transition-colors duration-300 ${
                    isSearchFocused ? 'text-purple-500' : 'text-zinc-600'
                  }`} />
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap gap-3 justify-center mt-8 pb-6">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    sortBy === option.value
                      ? 'bg-gradient-to-r from-red-500/20 via-purple-500/20 to-teal-500/20 text-zinc-100 shadow-lg border border-zinc-700/50 scale-105'
                      : 'bg-zinc-900/50 hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 border border-transparent hover:border-zinc-700/30'
                  }`}
                >
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section with Sidebar */}
      <div className="absolute top-[400px] left-0 right-0">
        <div className="container mx-auto px-2 max-w-[1800px]">
          <div className="flex gap-4">
            {/* Sidebar */}
            <div className="w-56 flex-shrink-0">
              {/* Favorites Button */}
              <button
                onClick={handleShowFavorites}
                className={`w-full mb-4 relative group px-4 py-3 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                  !user 
                    ? 'bg-zinc-900/50 border-zinc-800/50 opacity-50 cursor-not-allowed'
                    : showFavorites 
                      ? 'bg-red-500/20 border-red-500/50 text-red-100' 
                      : 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 text-zinc-100'
                }`}
                disabled={!user}
              >
                <div className="flex items-center gap-2 justify-center">
                  <FaHeart className={`text-lg ${showFavorites ? 'text-red-400' : 'text-zinc-400'}`} />
                  <span className="font-medium">
                    {!user ? 'Login to View Favorites' : 'Favorite Movies'}
                  </span>
                </div>
              </button>

              {/* Genres Section */}
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-4">
                <h3 className="text-zinc-100 font-medium mb-3 text-lg">Genres</h3>
                <div className="space-y-2">
                  {GENRES.map(genre => (
                    <button
                      key={genre.id}
                      onClick={() => toggleGenre(genre.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 ${
                        selectedGenres.includes(genre.id)
                          ? 'bg-gradient-to-r from-red-500/20 via-purple-500/20 to-teal-500/20 text-zinc-100'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Error Message */}
              {error && (
                <div className="flex items-center justify-center p-4 mb-8 bg-red-900/10 border border-red-900/20 text-red-200 rounded-xl backdrop-blur-sm">
                  <FaExclamationCircle className="mr-2 text-red-500" />
                  {error}
                </div>
              )}

              {/* Loading State for Favorites */}
              {favoritesLoading && showFavorites && (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner />
                </div>
              )}

              {/* Movies Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {loading && movies.length === 0 ? (
                  // Show skeletons while loading initial data
                  Array.from({ length: 10 }).map((_, index) => (
                    <MovieSkeleton key={index} />
                  ))
                ) : (
                  // Show actual movies
                  movies.map((movie) => (
                    <div key={movie.id} className="group relative transform transition-all duration-300 hover:scale-[1.02] hover:z-10">
                      {/* Hover Glow Effect */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 via-purple-500 to-teal-500 rounded-xl opacity-0 group-hover:opacity-75 blur transition duration-300"></div>
                      {/* Card Content */}
                      <div className="relative">
                        <MediaCard 
                          media={movie} 
                          isFavorite={favorites.some(fav => fav.id === movie.id)}
                          onFavoriteClick={() => toggleFavorite(movie)}
                          isLoggedIn={!!user}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Loading State */}
              {loading && <LoadingSpinner />}

              {/* Load More Button */}
              {!loading && hasMore && movies.length > 0 && !showFavorites && (
                <div className="flex justify-center mt-12 mb-8">
                  <button
                    onClick={handleLoadMore}
                    className="relative group px-8 py-4 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 hover:scale-105"
                  >
                    {/* Gradient Glow Effect */}
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-red-500/20 via-purple-500/20 to-teal-500/20 rounded-xl blur-lg group-hover:blur-xl group-hover:opacity-75 transition-all duration-300 opacity-0 group-hover:-inset-[3px]"></div>
                    
                    {/* Button Content */}
                    <div className="relative flex items-center gap-2">
                      <span className="text-zinc-100 font-medium text-lg">Load More Movies</span>
                      <svg 
                        className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200 transition-colors duration-300" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 9l-7 7-7-7" 
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              )}

              {/* No Results Message */}
              {!loading && !favoritesLoading && movies.length === 0 && (
                <div className="text-center mt-12 py-12 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
                  <FaSearch className="mx-auto text-5xl mb-4 text-zinc-700" />
                  <p className="text-xl text-zinc-500">
                    {showFavorites 
                      ? "No favorite movies yet. Start adding some!"
                      : "No movies found. Try a different search term."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;