import React, { useState, useEffect } from 'react';
import { FaSearch, FaHeart, FaTimes, FaArrowLeft, FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, getDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import AnimeCard from '../components/AnimeCard';
import AnimeModal from '../components/AnimeModal';
import FiltersModal from '../components/FiltersModal';
import { searchAnime } from '../api/anilistApi';

const AnimeMangaPage = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaType, setMediaType] = useState('ANIME');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    genres: [],
    year: '',
    status: '',
    sort: 'POPULARITY_DESC'
  });
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [total, setTotal] = useState(0);
  const [favorites, setFavorites] = useState([]);

  const ITEMS_PER_PAGE = 50;
  const MAX_PAGE_BUTTONS = 5;

  const handleSearch = async (e) => {
    e.preventDefault();
    setShowFavorites(false);
    setPage(1);
    setResults([]);
    setHasMore(true);
    setError(null);
    fetchAnime(searchQuery, 1);
  };

  const fetchAnime = async (query = '', pageNum = 1) => {
    try {
      setLoading(true);
      const data = await searchAnime(query, mediaType, pageNum, activeFilters);
      setResults(data.Page.media); 
      setHasMore(data.Page.pageInfo.hasNextPage);
      setTotal(data.Page.pageInfo.total);
    } catch (error) {
      console.error('Error fetching anime:', error);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchAnime(searchQuery, nextPage);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAnime(searchQuery, nextPage);
    }
  };

  const toggleFavorite = async (anime) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Create a clean anime object with only the necessary data
      const cleanAnimeData = {
        id: anime.id,
        title: anime.title || {},
        coverImage: anime.coverImage || {},
        format: anime.format || null,
        seasonYear: anime.seasonYear || null,
        type: anime.type || 'ANIME'
      };

      // Update local state first for immediate feedback
      const isCurrentlyFavorite = favorites.some(fav => fav.id === anime.id);
      const newFavorites = isCurrentlyFavorite
        ? favorites.filter(fav => fav.id !== anime.id)
        : [...favorites, cleanAnimeData];
      
      setFavorites(newFavorites);

      // Then update Firestore
      await setDoc(userRef, {
        favorites: newFavorites
      }, { merge: true });

    } catch (error) {
      // Revert local state if Firestore update fails
      console.error('Error updating favorites:', error);
      setError('Failed to update favorites. Please check your internet connection and try again.');
    }
  };

  const handleFilterApply = (newFilters) => {
    setActiveFilters(newFilters);
    setPage(1);
    setResults([]);
    setHasMore(true);
    fetchAnime(searchQuery, 1);
  };

  const resetToMain = () => {
    setShowFavorites(false);
    setSearchQuery('');
    setActiveFilters({
      genres: [],
      year: '',
      status: '',
      sort: 'POPULARITY_DESC'
    });
    setPage(1);
    setResults([]);
    setHasMore(true);
    fetchAnime('', 1);
  };

  const toggleFavoritesView = () => {
    setShowFavorites(!showFavorites);
    if (!showFavorites) {
      setResults([]);
      setHasMore(false);
    } else {
      fetchAnime('', 1);
    }
  };

  const handleBack = () => {
    if (searchQuery) {
      setSearchQuery('');
      setResults([]);
      fetchAnime();
    } else {
      navigate('/');
    }
  };

  const hasActiveFilters = () => {
    return activeFilters.genres.length > 0 || 
           activeFilters.year !== '' || 
           activeFilters.status !== '' || 
           activeFilters.sort !== 'POPULARITY_DESC' ||
           searchQuery !== '' ||
           showFavorites;
  };

  const handleMainPageBack = () => {
    navigate('/');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(total / ITEMS_PER_PAGE) || loading) return;
    setPage(newPage);
    setResults([]); 
    window.scrollTo(0, 0);
    fetchAnime(searchQuery, newPage);
  };

  const getPageNumbers = () => {
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    let pages = [];

    if (totalPages <= MAX_PAGE_BUTTONS) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    if (page > 3) pages.push('...');

    for (let i = Math.max(2, page - 1); i <= Math.min(page + 1, totalPages - 1); i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.pageYOffset > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!showFavorites) {
      setPage(1);
      setResults([]);
      setError(null);
      fetchAnime('', 1);
    }
  }, [mediaType, activeFilters]);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, 
      (doc) => {
        if (doc.exists()) {
          setFavorites(doc.data().favorites || []);
          setError(null); // Clear any previous errors
        }
      },
      (error) => {
        console.error('Error loading favorites:', error);
        // Don't show error for offline mode
        if (error.code !== 'failed-precondition' && error.code !== 'unavailable') {
          setError('Failed to load favorites. Please check your internet connection.');
        }
      }
    );

    return () => unsubscribe();
  }, [user]);

  const renderResults = () => {
    const displayedResults = showFavorites ? favorites : results;
    
    if (loading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {[...Array(24)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-800 rounded-lg aspect-[3/4.5]"></div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-gray-400 py-8">
          <p>{error}</p>
        </div>
      );
    }

    if (!displayedResults.length) {
      return (
        <div className="text-center text-gray-400 py-8">
          <p>{showFavorites ? 'No favorites yet' : 'No results found'}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {displayedResults.map((anime) => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            onCardClick={setSelectedAnime}
            isFavorite={favorites.some(fav => fav.id === anime.id)}
            onFavoriteClick={() => toggleFavorite(anime)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-[#121212] to-black overflow-x-hidden">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-gray-900 to-gray-900/95 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="flex flex-col space-y-1 w-full max-w-7xl md:mx-auto mx-auto px-4 py-3">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between w-full gap-4">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
            </button>

            {/* Search Bar */}
            <form className="flex-1 max-w-xl" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowFavorites(false);
                    setPage(1);
                    setResults([]);
                    setHasMore(true);
                    setError(null);
                    // Use debounce to avoid too many API calls
                    clearTimeout(window.searchTimeout);
                    window.searchTimeout = setTimeout(() => {
                      fetchAnime(e.target.value, 1);
                    }, 300);
                  }}
                  placeholder={`Search ${mediaType.toLowerCase()}...`}
                  className="w-full bg-gray-800/50 text-gray-100 placeholder-gray-400 rounded-full py-1 pl-8 pr-4 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
              </div>
            </form>

            {/* Right Side Controls */}
            <div className="flex items-center gap-4">
              {/* Media Type Toggle */}
              <div className="flex items-center space-x-2 bg-gray-800/30 rounded-full p-0.5">
                <button
                  onClick={() => setMediaType('ANIME')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    mediaType === 'ANIME'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Anime
                </button>
                <button
                  onClick={() => setMediaType('MANGA')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    mediaType === 'MANGA'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Manga
                </button>
              </div>

              {/* Favorites Button */}
              <button 
                onClick={toggleFavoritesView}
                className={`flex items-center space-x-1 px-3 py-1 text-sm transition-colors ${
                  showFavorites
                    ? 'text-purple-400 hover:text-purple-300'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>Favorites {favorites.length > 0 && `(${favorites.length})`}</span>
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {Object.values(activeFilters).some(v => Array.isArray(v) ? v.length > 0 : v !== '') && (
            <div className="flex flex-wrap gap-2 max-w-3xl mx-auto w-full">
              {activeFilters.genres.map(genre => (
                <span
                  key={genre}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300"
                >
                  {genre}
                </span>
              ))}
              {activeFilters.year && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                  Year: {activeFilters.year}
                </span>
              )}
              {activeFilters.status && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                  Status: {activeFilters.status.replace(/_/g, ' ')}
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-4">
        <div className="max-w-[2000px] mx-auto px-4">
          {/* Top Filter Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => handleFilterApply({ ...activeFilters, sort: 'POPULARITY_DESC' })}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                activeFilters.sort === 'POPULARITY_DESC'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => handleFilterApply({ ...activeFilters, sort: 'SCORE_DESC' })}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                activeFilters.sort === 'SCORE_DESC'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              Rating
            </button>
            <button
              onClick={() => handleFilterApply({ ...activeFilters, sort: 'START_DATE_DESC' })}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                activeFilters.sort === 'START_DATE_DESC'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              Latest
            </button>
          </div>

          {/* Results Grid with Sidebar */}
          <div className="flex gap-6">
            {/* Genre Sidebar */}
            <div className="w-48 shrink-0">
              <div className="bg-gray-800/50 rounded-xl p-4 sticky top-4">
                <h3 className="text-white font-medium mb-4 text-sm">Genres</h3>
                <div className="space-y-2">
                  {['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'].map(genre => (
                    <button
                      key={genre}
                      onClick={() => {
                        const newGenres = activeFilters.genres.includes(genre)
                          ? activeFilters.genres.filter(g => g !== genre)
                          : [...activeFilters.genres, genre];
                        handleFilterApply({ ...activeFilters, genres: newGenres });
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activeFilters.genres.includes(genre)
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Anime Grid */}
            <div className="flex-1 space-y-6">
              {renderResults()}

              {/* Pagination */}
              {!loading && !error && !showFavorites && results.length > 0 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || loading}
                    className={`px-3 py-1 rounded-md ${
                      page === 1 || loading
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {getPageNumbers().map((pageNum, index) => (
                    <button
                      key={index}
                      onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : null}
                      disabled={loading || pageNum === '...'}
                      className={`px-3 py-1 rounded-md ${
                        pageNum === page
                          ? 'bg-purple-600 text-white'
                          : pageNum === '...'
                          ? 'bg-transparent text-gray-400 cursor-default'
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === Math.ceil(total / ITEMS_PER_PAGE) || loading}
                    className={`px-3 py-1 rounded-md ${
                      page === Math.ceil(total / ITEMS_PER_PAGE) || loading
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Anime Details Modal */}
      {selectedAnime && (
        <AnimeModal
          anime={selectedAnime}
          onClose={() => setSelectedAnime(null)}
        />
      )}

      {/* Modals */}
      {showFilters && (
        <FiltersModal
          activeFilters={activeFilters}
          onApply={handleFilterApply}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default AnimeMangaPage;
