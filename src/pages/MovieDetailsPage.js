import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaPlay, FaClock, FaCalendar, FaArrowLeft } from 'react-icons/fa';
import { movieService } from '../services/movieService';
import MediaCard from '../components/MediaCard';
import YouTube from 'react-youtube';
import axios from 'axios';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const data = await movieService.getMovieDetails(id);
        setMovie(data);
        fetchMovieTrailer(data.title);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchMovieTrailer = async (movieTitle) => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
            movieTitle + " official trailer"
          )}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        );

        if (response.data.items && response.data.items.length > 0) {
          setVideoId(response.data.items[0].id.videoId);
        }
      } catch (err) {
        console.error('Error fetching trailer:', err);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="fixed top-8 left-8 z-10 flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      {movie && (
        <div className="container mx-auto px-4 py-24">
          {/* Trailer Section */}
          <div className="relative rounded-xl overflow-hidden mb-8 max-w-4xl mx-auto w-full aspect-video">
            {videoId ? (
              <YouTube
                videoId={videoId}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 1,
                    mute: 1,
                    modestbranding: 1,
                    rel: 0,
                  },
                }}
                className="w-full h-full"
                onEnd={() => {
                  const player = document.querySelector('iframe');
                  if (player) {
                    player.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                  }
                }}
              />
            ) : (
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Hero Section with Backdrop */}
          <div
            className="relative h-[60vh] bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${movie.backdrop_url})`
            }}
          >
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Poster */}
                <div className="hidden md:block">
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="rounded-lg shadow-2xl w-full max-w-[300px]"
                  />
                </div>

                {/* Movie Info */}
                <div className="md:col-span-2 text-white">
                  <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                  <div className="flex flex-wrap gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2">
                      <FaStar className="text-yellow-400" />
                      <span>{movie.vote_average?.toFixed(1)} / 10</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendar />
                      <span>{movie.release_date}</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Overview</h2>
                    <p className="text-gray-300">{movie.overview}</p>
                  </div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Genres</h2>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres?.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-red-500 rounded-full text-sm"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cast Section */}
          {movie.cast?.length > 0 && (
            <section className="py-12 bg-white dark:bg-gray-800">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {movie.cast.slice(0, 6).map((person) => (
                    <div key={person.id} className="text-center">
                      <img
                        src={person.profile_path ? movieService.getImageUrl(person.profile_path) : `https://via.placeholder.com/300x450?text=${encodeURIComponent(person.name)}`}
                        alt={person.name}
                        className="w-full rounded-lg mb-2"
                      />
                      <h3 className="font-semibold dark:text-white">{person.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Similar Movies */}
          {movie.similar?.length > 0 && (
            <section className="py-12 bg-gray-100 dark:bg-gray-900">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Similar Movies</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movie.similar.slice(0, 5).map((similarMovie) => (
                    <MediaCard
                      key={similarMovie.id}
                      media={similarMovie}
                      type="MOVIE"
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Recommendations */}
          {movie.recommendations?.length > 0 && (
            <section className="py-12 bg-white dark:bg-gray-800">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Recommended Movies</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movie.recommendations.slice(0, 5).map((recommendedMovie) => (
                    <MediaCard
                      key={recommendedMovie.id}
                      media={recommendedMovie}
                      type="MOVIE"
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;
