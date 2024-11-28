import React, { useState, useEffect } from 'react';
import { FaSearch, FaArrowLeft, FaStar, FaCalendar, FaFire, FaTrophy, FaGamepad } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import gameService from '../services/gameService';
import MediaCard from '../components/MediaCard';

const GamesPage = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [activeTab, setActiveTab] = useState('popular');

  useEffect(() => {
    fetchGenres();
    handleTabChange(activeTab);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      fetchGames();
    }
  }, [page, searchQuery]);

  const fetchGenres = async () => {
    try {
      const genreData = await gameService.getGenres();
      setGenres(genreData);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  const fetchGames = async (query = searchQuery) => {
    try {
      setLoading(true);
      setError(null);

      const data = await gameService.fetchGames({
        page,
        search: query,
        pageSize: 20,
        genres: selectedGenre?.id
      });

      if (page === 1) {
        setGames(data.results);
      } else {
        setGames(prev => [...prev, ...data.results]);
      }
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Failed to fetch games. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    setLoading(true);
    try {
      let data;
      switch (tab) {
        case 'new':
          data = await gameService.getNewReleases();
          break;
        case 'upcoming':
          data = await gameService.getUpcoming();
          break;
        case 'popular':
          data = await gameService.getPopular();
          break;
        case 'top':
          data = await gameService.getTopRated();
          break;
        default:
          data = await gameService.getPopular();
      }
      setGames(data.results);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Failed to fetch games. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchGames(searchQuery);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre === selectedGenre ? null : genre);
    setPage(1);
    fetchGames();
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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(50,50,50,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(50,50,50,0.15)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-900/20 via-indigo-900/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-emerald-900/20 via-green-900/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="text-zinc-100">Game</span>
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">Hub</span>
          </h1>
          <p className="text-zinc-400 text-lg">Discover your next gaming adventure</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full px-6 py-4 bg-zinc-900/90 border border-zinc-800/50 rounded-2xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-zinc-100"
            >
              <FaSearch className="text-xl" />
            </button>
          </div>
        </form>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => handleTabChange('popular')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
              activeTab === 'popular'
                ? 'bg-indigo-500 text-white'
                : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-100'
            } transition-all duration-300`}
          >
            <FaFire />
            <span>Popular</span>
          </button>
          <button
            onClick={() => handleTabChange('top')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
              activeTab === 'top'
                ? 'bg-indigo-500 text-white'
                : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-100'
            } transition-all duration-300`}
          >
            <FaTrophy />
            <span>Top Rated</span>
          </button>
          <button
            onClick={() => handleTabChange('new')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
              activeTab === 'new'
                ? 'bg-indigo-500 text-white'
                : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-100'
            } transition-all duration-300`}
          >
            <FaStar />
            <span>New Releases</span>
          </button>
          <button
            onClick={() => handleTabChange('upcoming')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
              activeTab === 'upcoming'
                ? 'bg-indigo-500 text-white'
                : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-100'
            } transition-all duration-300`}
          >
            <FaCalendar />
            <span>Upcoming</span>
          </button>
        </div>

        {/* Genres */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <FaGamepad />
            <span>Genres</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <button
                key={genre.id}
                onClick={() => handleGenreSelect(genre)}
                className={`px-4 py-2 rounded-xl ${
                  selectedGenre?.id === genre.id
                    ? 'bg-indigo-500 text-white'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-100'
                } transition-all duration-300`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        {error ? (
          <div className="text-center text-red-500 mb-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {games.map(game => (
              <MediaCard
                key={game.id}
                media={{
                  id: game.id,
                  title: game.name,
                  poster_url: game.background_image,
                  vote_average: game.rating,
                  release_date: game.released,
                  genres: game.genres
                }}
                type="GAME"
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {games.length > 0 && !loading && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
            >
              Load More
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesPage;

