import React, { useState, useEffect } from 'react';
import { FaHeart, FaStar, FaTimes, FaPlay, FaExternalLinkAlt, FaYoutube } from 'react-icons/fa';
import axios from 'axios';
import YouTube from 'react-youtube';

const AnimeModal = ({ anime, onClose }) => {
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
            `${anime.title?.english || anime.title?.romaji} ${anime.startDate?.year || ''} anime trailer PV`
          )}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        );

        if (response.data.items && response.data.items.length > 0) {
          setVideoId(response.data.items[0].id.videoId);
        }
      } catch (err) {
        console.error('Error fetching trailer:', err);
      }
    };

    if (anime) {
      fetchTrailer();
    }
  }, [anime]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="relative bg-gray-900 rounded-lg w-[90%] max-w-4xl mx-auto shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Close Button - Fixed position */}
        <div className="sticky top-0 right-0 z-50 float-right m-4">
          <button
            onClick={onClose}
            className="bg-black/50 p-2 rounded-full hover:bg-black/70 transition-all duration-300"
          >
            <FaTimes className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Trailer Section */}
        <div className="w-full aspect-video rounded-t-lg overflow-hidden">
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
                // Replay the video when it ends
                const player = document.querySelector('iframe');
                if (player) {
                  player.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                }
              }}
            />
          ) : anime.bannerImage ? (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
              <img
                src={anime.bannerImage}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column */}
            <div className="w-full md:w-1/3">
              <img
                src={anime.coverImage?.large || anime.coverImage?.medium}
                alt={anime.title?.english || anime.title?.romaji}
                className="w-full h-auto rounded-lg shadow-lg"
              />
              
              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                {/* External Links */}
                <a
                  href={anime.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  <FaExternalLinkAlt />
                  <span>View on AniList</span>
                </a>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-bold mb-2">
                {anime.title?.english || anime.title?.romaji}
              </h2>
              {anime.title?.native && (
                <h3 className="text-lg text-gray-400 mb-4">{anime.title.native}</h3>
              )}

              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  <span className="font-semibold">{anime.averageScore / 10}</span>
                  <span className="text-gray-400">/ 10</span>
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: anime.description }}
                />

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Format:</span>
                    <span className="ml-2">{anime.format}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Episodes:</span>
                    <span className="ml-2">{anime.episodes || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="ml-2">{anime.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Start Date:</span>
                    <span className="ml-2">
                      {anime.startDate?.year && `${anime.startDate.year}`}
                    </span>
                  </div>
                </div>

                {/* Genres */}
                <div>
                  <h4 className="text-gray-400 mb-2">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres?.map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeModal;
