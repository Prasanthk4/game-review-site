import React, { useState } from "react";
import axios from "axios";
import GameCard from "../components/GameCard";

const API_KEY = "85adddf9a31649db88b64131b7bcdd6c"; // Your RAWG API key

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
  };

  const handleSearchSubmit = () => {
    setIsSearching(true);
    axios
      .get(`https://api.rawg.io/api/games?key=${API_KEY}&search=${searchQuery}`)
      .then((response) => {
        const sortedResults = response.data.results.sort((a, b) => {
          const dateA = new Date(a.released);
          const dateB = new Date(b.released);
          return dateB - dateA; // Newest games first
        });
        setSearchResults(sortedResults);
        setIsSearching(false);
      })
      .catch((error) => {
        console.error("Error searching games:", error);
        setIsSearching(false);
      });
  };

  const handleGameClick = (gameId) => {
    window.location.href = `/game/${gameId}`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <div className="container mx-auto p-8">
      {/* Search Input */}
      <div className="flex items-center justify-center p-5">
        <div className="rounded-lg bg-gray-200 p-5">
          <div className="flex">
            <div className="flex w-10 items-center justify-center rounded-tl-lg rounded-bl-lg border-r border-gray-200 bg-white p-5">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="pointer-events-none absolute w-5 fill-gray-900 transition">
                <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="w-full max-w-[160px] bg-white pl-2 text-base font-semibold outline-0 text-gray-500"
              placeholder="Search games..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <input
              type="button"
              value="Search"
              className="bg-blue-500 p-2 rounded-tr-lg rounded-br-lg text-white font-semibold hover:bg-blue-800 transition-colors"
              onClick={handleSearchSubmit}
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {searchResults.map((game) => (
          <div key={game.id} onClick={() => handleGameClick(game.id)} className="cursor-pointer">
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
