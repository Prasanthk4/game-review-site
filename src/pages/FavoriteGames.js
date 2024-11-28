import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';

const FavoriteGames = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        const q = query(
          collection(db, 'favorites'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('addedAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const favoritesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setFavorites(favoritesData);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [auth.currentUser, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800/50 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/games')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700/90 transition-all duration-300"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaHeart className="text-pink-500" />
              Favorite Games
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-zinc-400">No favorite games yet</p>
            <button
              onClick={() => navigate('/games')}
              className="mt-4 px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-xl transition-all duration-300"
            >
              Browse Games
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(game => (
              <div
                key={game.id}
                className="group relative bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800/50 hover:border-pink-500/50 transition-all duration-300"
              >
                <div className="aspect-video">
                  <img
                    src={game.gameImage}
                    alt={game.gameName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold mb-2">{game.gameName}</h3>
                    <button
                      onClick={() => navigate(`/game/${game.gameId}`)}
                      className="w-full px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg transition-all duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteGames;
