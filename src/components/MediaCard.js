import React from 'react';
import { FaStar, FaHeart, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MediaCard = ({ media, type = 'MOVIE', isFavorite, onFavoriteClick, isLoggedIn }) => {
  const navigate = useNavigate();

  if (!media) return null;

  const {
    title,
    name,
    poster_path,
    poster_url,
    background_image,
    vote_average,
    rating,
    release_date,
    released,
    overview,
    id
  } = media;

  const displayTitle = title || name;
  const displayRating = rating || (vote_average ? (vote_average / 2).toFixed(1) : 'N/A');
  const displayDate = release_date || released;
  const posterImage = poster_url || background_image || (poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image');

  const releaseYear = displayDate ? new Date(displayDate).getFullYear() : 'N/A';

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteClick();
  };

  const handleCardClick = () => {
    navigate(`/${type.toLowerCase()}/${id}`);
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800/50 shadow-lg shadow-black/20">
      <div
        onClick={handleCardClick}
        className="cursor-pointer"
      >
        {/* Poster Image with Gradient Overlay */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={posterImage}
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          {/* Title and Year */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-white line-clamp-2">
              {displayTitle}
            </h3>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <FaCalendarAlt className="text-xs" />
              <span>{releaseYear}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-sm text-zinc-400">
            <FaStar className="text-yellow-500" />
            <span>{displayRating}</span>
          </div>
        </div>
      </div>

      {/* Favorite Button */}
      {isLoggedIn && (
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-2 rounded-full bg-black/50 backdrop-blur-sm transition-colors ${
            isFavorite ? 'text-pink-500' : 'text-zinc-400 hover:text-pink-500'
          }`}
        >
          <FaHeart />
        </button>
      )}
    </div>
  );
};

export default MediaCard;
