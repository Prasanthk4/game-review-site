import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaCalendar, FaArrowLeft, FaHeart } from 'react-icons/fa';
import gameService from '../services/gameService';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import MediaCard from '../components/MediaCard';

const GameDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchGameDetails();
    if (user) {
      checkIfFavorite();
    }
  }, [id, user]);

  const fetchGameDetails = async () => {
    try {
      setLoading(true);
      const data = await gameService.getGameDetails(id);
      setGame(data);
    } catch (err) {
      console.error('Error fetching game details:', err);
      setError('Failed to fetch game details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    if (!user) return;
    const userDoc = doc(db, 'users', user.uid);
    try {
      const docSnap = await userDoc.get();
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setIsFavorite(userData.favoriteGames?.includes(id) ?? false);
      }
    } catch (err) {
      console.error('Error checking favorite status:', err);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    const userDoc = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDoc, {
        favoriteGames: isFavorite ? arrayRemove(id) : arrayUnion(id)
      });
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error updating favorites:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!game) return null;

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-8 left-8 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/50 backdrop-blur-sm text-zinc-100 hover:bg-zinc-800/90 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        <FaArrowLeft className="text-lg" />
        <span className="font-medium">Back</span>
      </button>

      {/* Hero Section */}
      <div
        className="relative min-h-[60vh] bg-cover bg-center flex items-end"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,0.5), rgba(10,10,10,0.9)), url(${game.background_image})`
        }}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {/* Game Poster */}
            <div className="hidden md:block">
              <img
                src={game.background_image}
                alt={game.name}
                className="rounded-xl shadow-2xl"
              />
            </div>

            {/* Game Info */}
            <div className="md:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {game.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-yellow-400">
                  <FaStar />
                  <span className="text-white">{game.rating}/5</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <FaCalendar />
                  <span>{game.released}</span>
                </div>
                <button
                  onClick={toggleFavorite}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                    isFavorite
                      ? 'bg-red-500 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <FaHeart />
                  <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {game.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-zinc-400"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                {game.description_raw}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-900/50 p-4 rounded-xl">
                  <h3 className="text-zinc-400 text-sm mb-1">Platforms</h3>
                  <p className="text-white">
                    {game.platforms?.map((p) => p.platform.name).join(', ')}
                  </p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl">
                  <h3 className="text-zinc-400 text-sm mb-1">Developer</h3>
                  <p className="text-white">
                    {game.developers?.map((dev) => dev.name).join(', ')}
                  </p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl">
                  <h3 className="text-zinc-400 text-sm mb-1">Publisher</h3>
                  <p className="text-white">
                    {game.publishers?.map((pub) => pub.name).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshots */}
      {game.screenshots?.length > 0 && (
        <section className="py-12 bg-[#0A0A0A]">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6">Screenshots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {game.screenshots.map((screenshot) => (
                <img
                  key={screenshot.id}
                  src={screenshot.image}
                  alt={`${game.name} screenshot`}
                  className="w-full rounded-xl hover:opacity-75 transition-opacity cursor-pointer"
                  onClick={() => window.open(screenshot.image, '_blank')}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Similar Games */}
      {game.similar_games?.length > 0 && (
        <section className="py-12 bg-zinc-900/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6">Similar Games</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {game.similar_games.map((similarGame) => (
                <MediaCard
                  key={similarGame.id}
                  media={{
                    id: similarGame.id,
                    title: similarGame.name,
                    poster_url: similarGame.background_image,
                    vote_average: similarGame.rating,
                    release_date: similarGame.released,
                    genres: similarGame.genres
                  }}
                  type="GAME"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default GameDetailsPage;
