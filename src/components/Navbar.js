import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery) {
      navigate(`/search?query=${searchQuery}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <Link to="/" className="text-xl font-bold text-white">Game Review Hub</Link>
          <form onSubmit={handleSearch} className="px-4 w-full max-w-[500px] ml-4">
            <label className="mb-2 text-sm font-medium text-gray-300 sr-only" htmlFor="desktop-search">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-4 h-4 text-gray-400">
                  <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor"></path>
                </svg>
              </div>
              <input
                required=""
                placeholder="Search"
                className="block w-full p-4 py-5 pl-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 outline-none focus:border-blue-500"
                id="desktop-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2.5 bottom-1/2 translate-y-1/2 p-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              >
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-4 h-4">
                  <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor"></path>
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-white">Game Review Hub</Link>
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <form onSubmit={handleSearch} className="mb-4">
              <label className="mb-2 text-sm font-medium text-gray-300 sr-only" htmlFor="mobile-search">
                Search
              </label>
              <div className="relative">
                <input
                  required=""
                  placeholder="Search"
                  className="block w-full p-3 pl-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 outline-none focus:border-blue-500"
                  id="mobile-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2.5 bottom-1/2 translate-y-1/2 p-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                >
                  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-4 h-4">
                    <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor"></path>
                  </svg>
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
