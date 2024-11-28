import React, { useState, useEffect } from 'react';

import { Link } from "react-router-dom";
import { FaWindows, FaLinux, FaPlaystation, FaXbox } from "react-icons/fa"; 

const platformIcons = {
  pc: <FaWindows className="text-xl text-gray-500" />,
  linux: <FaLinux className="text-xl text-gray-500" />,
  playstation: <FaPlaystation className="text-xl text-blue-500" />,
  xbox: <FaXbox className="text-xl text-green-500" />,
};

const getPlatformIcon = (platformSlug) => {
  if (platformSlug.includes("pc")) return platformIcons.pc;
  if (platformSlug.includes("linux")) return platformIcons.linux;
  if (platformSlug.includes("playstation")) return platformIcons.playstation;
  if (platformSlug.includes("xbox")) return platformIcons.xbox;
  return null;
};

const GameCard = ({ game, onAddToWishlist, onRemoveFromWishlist, filter }) => {
  const [wishlist, setWishlist] = useState(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  });

  const platforms = game.platforms || [];
  const uniquePlatforms = new Set(
    platforms.map((p) => getPlatformIcon(p.platform.slug))
  );

  const handleClick = () => {
    setWishlist((prevWishlist) => {
      const newWishlist = [...prevWishlist];
      if (!newWishlist.find((item) => item.id === game.id)) {
        newWishlist.push(game);
      }
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const handleRemove = () => {
    setWishlist((prevWishlist) => {
      const newWishlist = prevWishlist.filter((item) => item.id !== game.id);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  return (
    <div className="service-card w-full sm:w-[350px] shadow-xl cursor-pointer snap-start shrink-0 bg-white flex flex-col items-start gap-3 transition-all duration-300 group hover:bg-[#202127] py-4 px-6">
      <Link to={`/game/${game.id}`} className="w-full">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-48 sm:h-auto object-cover rounded-lg mb-2"
        />
        <p className="font-bold text-xl sm:text-2xl group-hover:text-white text-black/80" style={{ fontFamily: "Poppins, sans-serif" }}>
          {game.name}
        </p>
        <p className="text-gray-400 text-xs sm:text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
          Released: {game.released}
        </p>
        {/* Display Unique Platform Icons */}
        <div className="flex gap-2 mt-2">
          {[...uniquePlatforms].map((icon, index) => icon && <span key={index}>{icon}</span>)}
        </div>
        <p
          style={{
            WebkitTextStroke: "1px gray",
            WebkitTextFillColor: "transparent",
            fontFamily: "Roboto Mono, monospace",
          }}
          className="text-4xl sm:text-5xl font-bold self-end"
        >
          {game.rating}
        </p>
      </Link>
      {/* Save Button */}
      <button
        title="Save"
        onClick={handleClick}
        className="cursor-pointer flex items-center fill-lime-400 bg-lime-950 hover:bg-lime-900 active:border active:border-lime-400 rounded-md duration-100 p-2 mt-4 w-full sm:w-auto justify-center sm:justify-start"
      >
        <svg viewBox="0 -0.5 25 25" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
          <path
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="1.5"
            d="M18.507 19.853V6.034C18.5116 5.49905 18.3034 4.98422 17.9283 4.60277C17.5532 4.22131 17.042 4.00449 16.507 4H8.50705C7.9721 4.00449 7.46085 4.22131 7.08577 4.60277C6.7107 4.98422 6.50252 5.49905 6.50705 6.034V19.853C6.45951 20.252 6.65541 20.6407 7.00441 20.8399C7.35342 21.039 7.78773 21.0099 8.10705 20.766L11.907 17.485C12.2496 17.1758 12.7705 17.1758 13.113 17.485L16.9071 20.767C17.2265 21.0111 17.6611 21.0402 18.0102 20.8407C18.3593 20.6413 18.5551 20.2522 18.507 19.853Z"
            clip-rule="evenodd"
            fill-rule="evenodd"
          ></path>
        </svg>
        <span className="text-sm text-lime-400 font-bold pr-1">Save</span>
      </button>
      {filter === "wishlist" && (
        <button
          title="Remove"
          onClick={handleRemove}
          className="cursor-pointer flex items-center fill-red-400 bg-red-950 hover:bg-red-900 active:border active:border-red-400 rounded-md duration-100 p-2 mt-4 w-full sm:w-auto justify-center sm:justify-start"
        >
          <svg viewBox="0 -0.5 25 25" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
            <path
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="1.5"
              d="M18.507 19.853V6.034C18.5116 5.49905 18.3034 4.98422 17.9283 4.60277C17.5532 4.22131 17.042 4.00449 16.507 4H8.50705C7.9721 4.00449 7.46085 4.22131 7.08577 4.60277C6.7107 4.98422 6.50252 5.49905 6.50705 6.034V19.853C6.45951 20.252 6.65541 20.6407 7.00441 20.8399C7.35342 21.039 7.78773 21.0099 8.10705 20.766L11.907 17.485C12.2496 17.1758 12.7705 17.1758 13.113 17.485L16.9071 20.767C17.2265 21.0111 17.6611 21.0402 18.0102 20.8407C18.3593 20.6413 18.5551 20.2522 18.507 19.853Z"
              clip-rule="evenodd"
              fill-rule="evenodd"
            ></path>
          </svg>
          <span className="text-sm text-red-400 font-bold pr-1">Remove</span>
        </button>
      )}
    </div>
  );
};

export default GameCard;
