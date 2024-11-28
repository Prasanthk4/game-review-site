import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaStar, FaGamepad, FaCalendarAlt, FaClock, FaCode, FaBuilding, FaTags, FaDesktop, FaShieldAlt, FaHeart } from "react-icons/fa";
import gameService from '../services/gameService';
import axios from "axios";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const YOUTUBE_URL = "https://www.googleapis.com/youtube/v3/search";

// Debug: Log environment variables (excluding sensitive data)
console.log("Environment Variables Status:", {
  YOUTUBE_API_KEY_EXISTS: !!process.env.REACT_APP_YOUTUBE_API_KEY,
  ENV_KEYS: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')),
});

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(3);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const gameData = await gameService.getGameDetails(id);
        setGame(gameData);
        console.log("Game data:", gameData);
        fetchYouTubeTrailer(gameData.name);

        // Check favorite status right after getting game details
        if (auth.currentUser) {
          const docRef = doc(db, 'favorites', `${auth.currentUser.uid}_${id}`);
          const docSnap = await getDoc(docRef);
          setIsFavorite(docSnap.exists());
        }

        const savedRating = localStorage.getItem(`rating_${id}`);
        if (savedRating) {
          setUserRating(parseInt(savedRating, 10));
        }
      } catch (err) {
        console.error('Error fetching game details:', err);
        setError("Failed to fetch game details. Please try again later.");
      }
    };

    fetchGameDetails();
  }, [id, auth.currentUser?.uid]);

  const toggleFavorite = async () => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const docRef = doc(db, 'favorites', `${auth.currentUser.uid}_${id}`);
      
      if (!isFavorite) {
        await setDoc(docRef, {
          userId: auth.currentUser.uid,
          gameId: id,
          gameName: game.name,
          gameImage: game.background_image,
          addedAt: new Date().toISOString()
        });
        setIsFavorite(true);
      } else {
        await deleteDoc(docRef);
        setIsFavorite(false);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchYouTubeTrailer = async (gameName) => {
    try {
      if (!YOUTUBE_API_KEY) {
        console.error("YouTube API key is not defined");
        setDebugInfo({
          error: "YouTube API key is not defined in environment variables",
          params: {
            query: `${gameName} official trailer`,
            key: "undefined"
          }
        });
        return;
      }

      console.log("Fetching trailer for:", gameName);
      const response = await axios.get(YOUTUBE_URL, {
        params: {
          part: 'snippet',
          q: `${gameName} official trailer`,
          key: YOUTUBE_API_KEY,
          maxResults: 1,
          type: 'video',
          videoEmbeddable: 'true'
        },
      });
      
      console.log("YouTube API response:", response.data);
      const video = response.data.items[0];
      if (video) {
        console.log("Found video:", video);
        setTrailer(video);
        setDebugInfo({
          videoId: video.id.videoId,
          title: video.snippet.title,
          url: `https://www.youtube.com/embed/${video.id.videoId}`
        });
      }
    } catch (err) {
      console.error("Failed to fetch YouTube trailer:", err.response ? err.response.data : err.message);
      setDebugInfo({ 
        error: err.response ? err.response.data : err.message,
        params: {
          query: `${gameName} official trailer`,
          key: YOUTUBE_API_KEY ? `${YOUTUBE_API_KEY.slice(0, 6)}...` : "undefined"
        }
      });
    }
  };

  const handleRatingChange = (event) => {
    const newRating = parseInt(event.target.value, 10);
    setUserRating(newRating);
    localStorage.setItem(`rating_${id}`, newRating);
  };

  if (error) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-red-500 text-xl">{error}</div>
    </div>
  );
  
  if (!game) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100">
      {/* Back Button and Favorite Button */}
      <div className="fixed top-8 left-8 z-[100] flex items-center gap-4">
        <button 
          onClick={() => navigate('/games')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/50 backdrop-blur-sm text-zinc-100 hover:bg-zinc-800/90 transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <FaArrowLeft className="text-lg" />
          <span className="font-medium">Back to Games</span>
        </button>
        
        <button
          onClick={toggleFavorite}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg ${
            isFavorite 
              ? 'bg-pink-500/90 text-white hover:bg-pink-600/90' 
              : 'bg-zinc-900/90 border border-zinc-800/50 text-zinc-100 hover:bg-zinc-800/90'
          }`}
        >
          <FaHeart className={`text-lg ${isLoading ? 'animate-pulse' : ''}`} />
          <span className="font-medium">{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-24">
        {/* Game Header */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          {trailer && trailer.id && trailer.id.videoId ? (
            <div className="w-full h-[400px] bg-zinc-900">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailer.id.videoId}?autoplay=1&mute=0&controls=1&showinfo=1&rel=0`}
                title={`${game.name} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <img
              src={game.background_image}
              alt={game.name}
              className="w-full h-[400px] object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{game.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              {game.genres.map(genre => (
                <span key={genre.id} className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-zinc-300 leading-relaxed">{game.description_raw}</p>
            </div>

            {/* Screenshots */}
            {game.screenshots?.length > 0 && (
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
                <div className="grid grid-cols-2 gap-4">
                  {game.screenshots.slice(0, 4).map((screenshot, index) => (
                    <img
                      key={screenshot.id}
                      src={screenshot.image}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Info */}
          <div className="space-y-8">
            {/* Rating Section */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Rating</h2>
              <div className="flex items-center gap-2 text-xl mb-4">
                <FaStar className="text-yellow-500" />
                <span className="font-bold">{game.rating}</span>
                <span className="text-zinc-400">/ 5</span>
                <span className="text-sm text-zinc-400">({game.ratings_count} ratings)</span>
              </div>
              
              {/* User Rating */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Rate this Game</h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange({ target: { value: star } })}
                      className={`p-2 rounded-lg transition-colors ${
                        userRating >= star ? 'text-yellow-500' : 'text-zinc-600'
                      }`}
                    >
                      <FaStar className="text-2xl" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Info */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Game Info</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-indigo-500" />
                  <div>
                    <p className="text-sm text-zinc-400">Release Date</p>
                    <p>{game.released || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaClock className="text-indigo-500" />
                  <div>
                    <p className="text-sm text-zinc-400">Average Playtime</p>
                    <p>{game.playtime ? `${game.playtime} hours` : 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaCode className="text-indigo-500" />
                  <div>
                    <p className="text-sm text-zinc-400">Developers</p>
                    <p>{game.developers?.map(dev => dev.name).join(', ') || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaBuilding className="text-indigo-500" />
                  <div>
                    <p className="text-sm text-zinc-400">Publishers</p>
                    <p>{game.publishers?.map(pub => pub.name).join(', ') || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaDesktop className="text-indigo-500" />
                  <div>
                    <p className="text-sm text-zinc-400">Platforms</p>
                    <p>{game.platforms?.map(p => p.platform.name).join(', ') || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-indigo-500" />
                  <div>
                    <p className="text-sm text-zinc-400">Age Rating</p>
                    <p>{game.esrb_rating?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {game.tags?.length > 0 && (
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {game.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 text-sm rounded-full bg-zinc-800 text-zinc-300"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
