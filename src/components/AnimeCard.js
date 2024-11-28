import React from 'react';
import { FaHeart } from 'react-icons/fa';

const AnimeCard = ({ anime, onCardClick, isFavorite, onFavoriteClick }) => {
  // Helper function to get the title safely
  const getTitle = () => {
    if (typeof anime.title === 'string') return anime.title;
    return anime.title?.english || anime.title?.romaji || 'Unknown Title';
  };

  return (
    <div className="relative group">
      <div
        onClick={() => onCardClick(anime)}
        className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
      >
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <img
            src={anime.coverImage?.large || anime.coverImage?.medium}
            alt={getTitle()}
            className="w-full aspect-[3/4] object-cover"
          />
          <div className="p-2">
            <h3 className="text-white font-medium text-sm truncate">
              {getTitle()}
            </h3>
            <div className="flex items-center mt-1 text-xs text-gray-400">
              <span>{anime.seasonYear || 'TBA'}</span>
              <span className="mx-1">•</span>
              <span>{anime.format || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteClick(anime);
        }}
        className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
          isFavorite 
            ? 'bg-pink-500 text-white scale-100' 
            : 'bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-black/70'
        }`}
      >
        <FaHeart className="w-3 h-3" />
      </button>
    </div>
  );
};

export default AnimeCard;
