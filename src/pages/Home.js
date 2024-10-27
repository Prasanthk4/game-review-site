import React, { useState, useEffect } from "react";
import { getGamesList, getGamesByGenre, getGamesByPlatform } from "../services/rawgAPI";
import GameCard from "../components/GameCard";
import { Link } from "react-router-dom"; 
import '../styles/Sidebar.css';
import '../styles/styles.css';

const Home = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("new");
  const [sortOption, setSortOption] = useState("released");
  const [showMorePlatforms, setShowMorePlatforms] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  });
  const GAMES_PER_PAGE = 6;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filterParam = params.get('filter');
    if (filterParam === 'wishlist') {
      setFilter('wishlist');
      setGames(wishlist);
      setTotalPages(1);
    }

    const fetchGames = async () => {
      try {
        let gamesData;
        const today = new Date().toISOString().split('T')[0];

        if (filter === "wishlist") {
          setGames(wishlist);
          setTotalPages(1); // Only one page for wishlist
          return;
        }

        if (filter === "popular") {
          gamesData = await getGamesList(currentPage, GAMES_PER_PAGE);
        } else if (filter === "new") {
          const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
            .toISOString()
            .split('T')[0];
          gamesData = await getGamesList(currentPage, GAMES_PER_PAGE, `&dates=${lastMonth},${today}&ordering=-released`);
        } else if (filter === "upcoming") {
          gamesData = await getGamesList(currentPage, GAMES_PER_PAGE, `&dates=${today},9999-12-31&ordering=release_date`);
        } else if (["4", "18", "187", "1", "186", "7"].includes(filter)) {
          gamesData = await getGamesByPlatform(filter, currentPage, GAMES_PER_PAGE, sortOption);
        } else {
          gamesData = await getGamesByGenre(filter, currentPage, GAMES_PER_PAGE, sortOption);
        }

        setGames(gamesData.results);
        setTotalPages(Math.ceil(gamesData.count / GAMES_PER_PAGE));
      } catch (err) {
        setError("Failed to fetch games. Please try again later.");
      }
    };
    fetchGames();
  }, [filter, currentPage, sortOption, wishlist]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
    if (newFilter === "wishlist") {
      setWishlist(() => {
        const storedWishlist = localStorage.getItem('wishlist');
        return storedWishlist ? JSON.parse(storedWishlist) : [];
      });
    } else if (newFilter === "popular" || newFilter === "new" || newFilter === "upcoming") {
      setSortOption("released");
    }
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setCurrentPage(1);
  };

  const toggleShowMorePlatforms = () => {
    setShowMorePlatforms((prev) => !prev);
  };

  if (error) return <div className="text-red-500">{error}</div>;

  const platforms = [
    { name: "PC", slug: "4" },
    { name: "PlayStation 4", slug: "18" },
    { name: "PlayStation 5", slug: "187" },
    { name: "Xbox One", slug: "1" },
    { name: "Xbox Series X/S", slug: "186" },
    { name: "Nintendo Switch", slug: "7" },
  ];

  const handleRemoveFromWishlist = (gameId) => {
    setWishlist((prevWishlist) => {
      const newWishlist = prevWishlist.filter((game) => game.id !== gameId);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="w-1/5 p-4 bg-black">
        <Link to="/" className="text-4xl font-bold text-white mb-4" style={{ color: "rgb(200, 20, 10)" }}>
          GameCritic
        </Link>

        {/* Quick Filters */}
        <div className="mb-20"></div>
        <div className="relative group mb-3">
          <div className="relative w-64 h-12 overflow-hidden rounded-xl bg-gray-900 z-1">
            <div className="absolute z-10 -translate-x-44 group-hover:translate-x-[30rem] ease-in transition-all duration-700 h-full w-44 bg-gradient-to-r from-gray-500 to-white/10 opacity-30 -skew-x-12"></div>
            <div className="absolute flex items-center justify-center text-white z-[1] rounded-2xl inset-0.5 bg-gray-900">
              <h3 className="font-semibold text-md h-full w-100 px-13 py-2">
                Quick Filters
              </h3>
            </div>
            <div className="absolute duration-1000 group-hover:animate-spin w-full h-[100px] bg-gradient-to-r from-green-500 to-yellow-500 blur-[30px]"></div>
          </div>
        </div>

        {['popular', 'new', 'upcoming', 'wishlist'].map((filterType, index) => (
          <button
            key={index}
            onClick={() => handleFilterChange(filterType)}
            className={`block w-full mb-2 text-left text-white ${filterType === 'popular' ? 'bg-blue-600 hover:bg-blue-700' : filterType === 'new' ? 'bg-green-600 hover:bg-green-700' : filterType === 'upcoming' ? 'bg-purple-600 hover:bg-purple-700' : filterType === 'wishlist' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-orange-600 hover:bg-orange-700'} transition-all duration-300 py-1.5 px-3 rounded-lg`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)} Games {filterType === 'wishlist' ? `(${wishlist.length})` : ''}
          </button>
        ))}

        {/* Genres Heading */}
        <div className="mb-12"></div>
        <div className="relative group mb-3">
          <div className="relative w-64 h-12 overflow-hidden rounded-xl bg-gray-900 z-1">
            <div className="absolute z-10 -translate-x-44 group-hover:translate-x-[30rem] ease-in transition-all duration-700 h-full w-44 bg-gradient-to-r from-gray-500 to-white/10 opacity-30 -skew-x-12"></div>
            <div className="absolute flex items-center justify-center text-white z-[1] rounded-2xl inset-0.5 bg-gray-900">
              <h3 className="font-semibold text-md h-full w-100 px-13 py-2">
                Genres
              </h3>
            </div>
            <div className="absolute duration-1000 group-hover:animate-spin w-full h-[100px] bg-gradient-to-r from-green-500 to-yellow-500 blur-[30px]"></div>
          </div>
        </div>

        {["action", "strategy", "shooter", "adventure"].map((genre) => (
          <button
            key={genre}
            onClick={() => handleFilterChange(genre)}
            className="block w-full mb-2 text-left text-white bg-gray-700 hover:bg-gray-600 transition-all duration-300 py-1.5 px-3 rounded-lg"
          >
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </button>
        ))}

        {/* Platforms Heading */}
        <div className="mb-12"></div>
        <div className="relative group mb-3">
          <div className="relative w-64 h-12 overflow-hidden rounded-xl bg-gray-900 z-1">
            <div className="absolute z-10 -translate-x-44 group-hover:translate-x-[30rem] ease-in transition-all duration-700 h-full w-44 bg-gradient-to-r from-gray-500 to-white/10 opacity-30 -skew-x-12"></div>
            <div className="absolute flex items-center justify-center text-white z-[1] rounded-2xl inset-0.5 bg-gray-900">
              <h3 className="font-semibold text-md h-full w-100 px-13 py-2">
                Platforms
              </h3>
            </div>
            <div className="absolute duration-1000 group-hover:animate-spin w-full h-[100px] bg-gradient-to-r from-green-500 to-yellow-500 blur-[30px]"></div>
          </div>
        </div>

        {platforms.slice(0, showMorePlatforms ? platforms.length : 3).map((platform) => (
          <button
            key={platform.slug}
            onClick={() => handleFilterChange(platform.slug)}
            className="block w-full mb-2 text-left text-white bg-gray-700 hover:bg-gray-600 transition-all duration-300 py-1.5 px-3 rounded-lg"
          >
            {platform.name}
          </button>
        ))}
        <button
          onClick={toggleShowMorePlatforms}
          className="mt-2 text-white bg-gray-600 hover:bg-gray-500 transition-colors duration-300 py-1.5 px-3 rounded-lg"
        >
          {showMorePlatforms ? "Hide" : "More"}
        </button>
      </div>

      {/* Main content area */}
      <div className="flex-grow p-8 bg-black">
        {/* Search Bar - Centered */}
        <div className="flex justify-center mb-6">
          <Link to="/search" className="w-full max-w-lg">
            <input
              type="text"
              placeholder="Search for games..."
              className="p-2 w-full rounded-lg text-black"
            />
          </Link>
        </div>

        <h1 className="ui-btn">
          <span>
            {filter === "wishlist" ? "Your Wishlist" : 
              filter === "popular" ? "Popular Games" :
              filter === "new" ? "New Games" :
              filter === "upcoming" ? "Upcoming Games" :
              platforms.find((p) => p.slug === filter)?.name || 
              filter.charAt(0).toUpperCase() + filter.slice(1) + " Games"}
          </span>
        </h1>

        {(filter !== "popular" && filter !== "new" && filter !== "upcoming" && filter !== "wishlist") && (
          <div className="mb-4">
            <label className="text-white" htmlFor="sort">Sort By:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="ml-2 p-2 rounded-lg bg-gray-700 text-white"
            >
              <option value="relevance">Relevance</option>
              <option value="date_added">Date Added</option>
              <option value="name">Name</option>
              <option value="released">Release Date</option>
              <option value="popularity">Popularity</option>
              <option value="rating">Average Rating</option>
            </select>
          </div>
        )}

        {/* Game cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filter === "wishlist" ? (
            wishlist.map((game) => (
              <GameCard key={game.id} game={game} onAddToWishlist={(game) => setWishlist((prev) => [...prev, game])} onRemoveFromWishlist={handleRemoveFromWishlist} filter="wishlist" />
            ))
          ) : (
            games.map((game) => (
              <GameCard key={game.id} game={game} onAddToWishlist={(game) => setWishlist((prev) => [...prev, game])} onRemoveFromWishlist={handleRemoveFromWishlist} filter={filter} />
            ))
          )}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50 hover:bg-blue-600 transition duration-300"
          >
            Previous
          </button>
          <span className="text-white">Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50 hover:bg-blue-600 transition duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
