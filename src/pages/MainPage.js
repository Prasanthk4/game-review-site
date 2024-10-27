import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../services/UserContext'; 
import { auth } from '../services/firebase'; 
import './MainPage.css';

const MainPage = () => {
  const { user } = useContext(UserContext); // Get user data from context
  const [wishlist, setWishlist] = useState([]); // State to hold wishlist items
  const [showDropdown, setShowDropdown] = useState(false); // State to toggle dropdown visibility
  const [firstName, setFirstName] = useState(''); // Subscription form first name
  const [lastName, setLastName] = useState(''); // Subscription form last name
  const [email, setEmail] = useState(''); // Subscription form email
  const navigate = useNavigate();

  // Handles subscription form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Subscribed ${firstName} ${lastName} with email: ${email}`);
  };

  // Adds a game to the wishlist
  const addToWishlist = (game) => {
    setWishlist((prev) => [...prev, game]);
    alert(`${game.name} has been added to your wishlist!`);
  };

  // Toggles dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Navigates to the wishlist section on the homepage
  const navigateToWishlist = () => {
    navigate('/home?filter=wishlist');
  };

  // Logs out the user and redirects to login
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="relative h-screen overflow-y-scroll bg-black main-page">
      {/* Background video */}
      <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted>
        <source src={require('../air.mp4')} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6">
        <header className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold font-sans" style={{ color: "rgb(200, 20, 10)" }}>GameCritic</h1>

          {/* User Info and Dropdown */}
          {user ? (
            <div className="account-dropdown relative">
              <button 
                onClick={toggleDropdown} 
                className="text-white flex items-center"
                style={{ padding: '8px 12px', border: 'none', background: 'transparent', minWidth: '40px', minHeight: '40px' }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="50"
                  height="50"
                  id="account"
                  fill="currentColor"
                  className="mr-2"
                >
                  <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 6c3.31 0 6 2.69 6 6 0 3.32-2.69 6-6 6s-6-2.68-6-6c0-3.31 2.69-6 6-6zm0 28.4c-5.01 0-9.41-2.56-12-6.44.05-3.97 8.01-6.16 12-6.16s11.94 2.19 12 6.16c-2.59 3.88-6.99 6.44-12 6.44z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                <span>{user.displayName || 'User'}</span>
              </button>
              
              {/* Dropdown content */}
              <div className={`dropdown-content ${showDropdown ? 'show' : ''}`}>
                <button onClick={navigateToWishlist} className="wishlist-link">
                  Go to Wishlist
                </button>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <button className="login-button text-white px-4 py-2 rounded hover:bg-red-600 transition" style={{ border: "1px solid rgb(200, 20, 10)" }}>
                Login
              </button>
            </Link>
          )}
        </header>

        {/* Add other components like the video review section, subscription form, etc. */}

        <div className="flex-grow" />

        {/* "Play!" Button */}
        <div className="flex justify-center my-20 mb-20">
          <button className="button" onClick={() => navigate('/home')}>
            Play!
          </button>
        </div>

        {/* Video Review Section */}
        <div className="mb-25">
          <h2 className="text-2xl font-semibold text-center">
            Are you a gamer looking for the next big thing? Don't miss our latest video review! Click play to discover hidden gems and must-have titles.
          </h2>
          <video className="mx-auto w-full md:w-2/5 rounded-lg shadow-lg" autoPlay loop muted>
            <source src={require('../reel.mp4')} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Subscription Form */}
        <div className="bg-black bg-opacity-70 p-6 rounded-lg text-center mb-6">
          <h2 className="text-3xl font-semibold mb-4" style={{ color: "rgb(200, 20, 10)" }}>
            Become an Exclusive GameCritic Member!
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="flex space-x-4">
              <input 
                type="text" 
                placeholder="First Name*" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="p-3 rounded border border-gray-300 bg-transparent hover:border-red-600 transition text-gray-800"
                required
              />
              <input 
                type="text" 
                placeholder="Last Name*" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="p-3 rounded border border-gray-300 bg-transparent hover:border-red-600 transition text-gray-800"
                required
              />
              <input 
                type="email" 
                placeholder="Email*" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 rounded border border-gray-300 bg-transparent hover:border-red-600 transition text-gray-800"
                required
              />
            </div>
            <label className="flex items-center my-4">
              <input type="checkbox" className="mr-2" required />
              Yes, subscribe me to your newsletter.
            </label>
            <button 
              type="submit" 
              className="text-white px-6 py-2 rounded hover:bg-red-600 hover:border-red-600 transition" 
              style={{ color: "rgb(200, 20, 10)", border: "1px solid rgb(200, 20, 10)" }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
