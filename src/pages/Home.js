import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGamepad, FaFilm, FaYoutube, FaArrowRight } from 'react-icons/fa';
import { SiMyanimelist } from 'react-icons/si';

const Home = () => {
  const navigate = useNavigate();

  // Floating animation variants
  const floatAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 bg-grid-pattern"></div>
      <div className="fixed inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-overlay filter blur-xl opacity-30"
            animate={{
              x: [0, 100, 0],
              y: [0, 100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 2,
            }}
            style={{
              width: 300 + i * 100,
              height: 300 + i * 100,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: `radial-gradient(circle, ${['#4F46E5', '#7C3AED', '#EC4899'][i % 3]} 0%, transparent 70%)`,
            }}
          />
        ))}
      </div>

      <div className="relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 pt-20 pb-32 text-center"
        >
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-7xl font-bold mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Entertainment
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-500">
              Hub
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-12"
          >
            Your Gateway to Entertainment
          </motion.div>
        </motion.div>

        {/* Main Navigation Cards */}
        <div className="container mx-auto px-4 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Games Card */}
            <motion.div
              variants={floatAnimation}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.05, rotateY: 10 }}
              className="group relative"
            >
              <div className="absolute inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-black/90 rounded-2xl p-8 h-full backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <FaGamepad className="text-6xl mb-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                <h3 className="text-2xl font-bold mb-4">Games</h3>
                <p className="text-gray-400 mb-6">Discover the latest and greatest in gaming</p>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/games')}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-300"
                >
                  Explore Games <FaArrowRight />
                </motion.button>
              </div>
            </motion.div>

            {/* Movies Card */}
            <motion.div
              variants={floatAnimation}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.05, rotateY: 10 }}
              className="group relative"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-black/90 rounded-2xl p-8 h-full backdrop-blur-xl border border-white/10 hover:border-blue-500/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <FaFilm className="text-6xl mb-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                <h3 className="text-2xl font-bold mb-4">Movies</h3>
                <p className="text-gray-400 mb-6">Explore a world of cinematic wonders</p>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/movies')}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300"
                >
                  Explore Movies <FaArrowRight />
                </motion.button>
              </div>
            </motion.div>

            {/* Anime Card */}
            <motion.div
              variants={floatAnimation}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.05, rotateY: 10 }}
              className="group relative"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="absolute inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-black/90 rounded-2xl p-8 h-full backdrop-blur-xl border border-white/10 hover:border-red-500/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <SiMyanimelist className="text-6xl mb-6 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
                <h3 className="text-2xl font-bold mb-4">Anime</h3>
                <p className="text-gray-400 mb-6">Dive into the world of anime</p>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/anime')}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors duration-300"
                >
                  Explore Anime <FaArrowRight />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="container mx-auto px-4 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-6xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
              <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Featured Content
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Latest Reviews</h3>
                  <p className="text-gray-400 mb-6">
                    Check out our latest game reviews, movie critiques, and anime recommendations.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                  >
                    View Latest
                  </motion.button>
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
                  <FaYoutube className="absolute inset-0 m-auto text-7xl text-red-500 animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
