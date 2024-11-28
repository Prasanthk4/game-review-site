import React from 'react';
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const MovieCard = ({ movie, onAddToWishlist }) => {
  if (!movie) return null;

  const handleClick = () => {
    if (onAddToWishlist) {
      onAddToWishlist(movie);
    }
  };

  // Fallback image URL
  const fallbackImageUrl = 'https://via.placeholder.com/500x750?text=No+Image+Available';
  
  // Format date to be more readable
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Release date unknown';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="w-full sm:w-[350px] shadow-xl cursor-pointer snap-start shrink-0 bg-white flex flex-col items-start gap-3 transition-all duration-300 group hover:bg-[#202127] py-4 px-6 rounded-lg">
      <Link to={`/movie/${movie.id}`} className="w-full">
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : fallbackImageUrl}
          alt={movie.title || 'Movie poster'}
          className="w-full h-48 sm:h-auto object-cover rounded-lg mb-2"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImageUrl;
          }}
        />
        <p className="font-bold text-xl sm:text-2xl group-hover:text-white text-black/80" style={{ fontFamily: "Poppins, sans-serif" }}>
          {movie.title || 'Untitled Movie'}
        </p>
        <p className="text-gray-400 text-xs sm:text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
          Released: {formatDate(movie.release_date)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <FaStar className="text-yellow-400" />
          <span className="text-gray-600 group-hover:text-white">
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </span>
          {movie.vote_count > 0 && (
            <span className="text-gray-400 text-sm">({movie.vote_count} votes)</span>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-2 line-clamp-2 group-hover:text-gray-300">
          {movie.overview || 'No description available'}
        </p>
      </Link>
      <button
        title="Save"
        onClick={handleClick}
        className="cursor-pointer flex items-center fill-lime-400 bg-lime-950 hover:bg-lime-900 active:border active:border-lime-400 rounded-md duration-100 p-2 mt-4 w-full sm:w-auto justify-center sm:justify-start"
      >
        <svg viewBox="0 -0.5 25 25" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="1.5"
            d="M18.507 19.853V6.034C18.5116 5.49905 18.3034 4.98422 17.9283 4.60277C17.5532 4.22131 17.042 4.00449 16.507 4H8.50705C7.9721 4.00449 7.46085 4.22131 7.08577 4.60277C6.7107 4.98422 6.50252 5.49905 6.50705 6.034V19.853C6.45951 20.252 6.65541 20.6407 7.00441 20.8399C7.35342 21.039 7.78773 21.0099 8.10705 20.766L11.907 17.485C12.2496 17.1758 12.7705 17.1758 13.113 17.485L16.9071 20.767C17.2265 21.0111 17.6611 21.0402 18.0102 20.8407C18.3593 20.6413 18.5551 20.2522 18.507 19.853Z"
            clipRule="evenodd"
            fillRule="evenodd"
          ></path>
        </svg>
        <span className="text-sm text-lime-400 font-bold pr-1">Save</span>
      </button>
    </div>
  );
};

export default MovieCard;
