import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';
import { FaGamepad, FaFilm, FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const sections = [
    {
      title: "Games",
      description: "Discover the latest and greatest in gaming",
      icon: FaGamepad,
      route: "/games",
      gradient: "from-gray-900 to-gray-700"
    },
    {
      title: "Movies",
      description: "Explore a world of cinematic wonders",
      icon: FaFilm,
      route: "/movies",
      gradient: "from-gray-900 to-gray-700"
    },
    {
      title: "Anime",
      description: "Dive into the world of anime",
      icon: FaPlay,
      route: "/anime",
      gradient: "from-gray-900 to-gray-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Dark Overlay */}
      <div className="dark-overlay"></div>
      
      {/* Vignette Effect */}
      <div className="vignette"></div>

      {/* Background 3D Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="floating-cube top-20 left-[10%]"></div>
        <div className="floating-cube top-[60%] left-[85%]"></div>
        <div className="floating-sphere top-[30%] left-[80%]"></div>
        <div className="floating-sphere top-[70%] left-[15%]"></div>
        <div className="floating-ring top-40 left-[75%]"></div>
        <div className="floating-ring top-[80%] left-[25%]"></div>
        
        {/* Animated Lines */}
        <div className="grid-lines"></div>

        {/* Glowing Orbs */}
        <div className="orb-group-1">
          <div className="glowing-orb"></div>
          <div className="glowing-orb"></div>
          <div className="glowing-orb"></div>
        </div>
        <div className="orb-group-2">
          <div className="glowing-orb"></div>
          <div className="glowing-orb"></div>
          <div className="glowing-orb"></div>
        </div>

        {/* Floating Particles */}
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="floating-particle" style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center h-16">
              {/* Logo */}
              <div className="absolute left-0">
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-gradient"
                >
                  Rated Realm
                </motion.h1>
              </div>

              {/* Auth Buttons */}
              <div className="absolute right-0">
                {!user ? (
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-all"
                      onClick={() => navigate('/login')}
                    >
                      Login
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
                      onClick={() => navigate('/signup')}
                    >
                      Sign Up
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Welcome back</p>
                        <p className="text-white font-medium">{user.email}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-all"
                      >
                        Logout
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15]"></div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-7xl font-bold mb-6">
                <span className="block text-gradient">
                  Your Ultimate
                </span>
                <span className="block text-gradient">
                Rated Realm
                </span>
              </h1>
              <p className="text-xl text-gray-400 mb-12">
                Discover and explore your favorite games, movies, and anime all in one place
              </p>
            </motion.div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`category-card relative overflow-hidden rounded-xl p-6 flex flex-col items-center text-center space-y-4 bg-gradient-to-br ${section.gradient}`}
                >
                  <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                    <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                  </div>

                  {/* 3D Floating Icon */}
                  <motion.div 
                    className="text-4xl text-white floating-icon"
                    animate={{ 
                      y: [0, -10, 0],
                      rotateY: [0, 360]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <section.icon />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-white">
                    {section.title}
                  </h2>
                  <p className="text-gray-400">
                    {section.description}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(section.route)}
                    className="explore-btn mt-4 px-8 py-3 rounded-lg text-white font-semibold"
                  >
                    Explore
                  </motion.button>

                  {/* 3D Decorative Elements */}
                  <div className="absolute -z-10 opacity-50">
                    <div className="floating-shapes"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
