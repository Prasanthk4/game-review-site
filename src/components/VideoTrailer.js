import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';

const VideoTrailer = ({ title, type }) => {
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const searchQuery = `${title} ${type} official trailer`;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
            searchQuery
          )}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch trailer');
        }

        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setVideoId(data.items[0].id.videoId);
        } else {
          setError('No trailer found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (title) {
      fetchTrailer();
    }
  }, [title, type]);

  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  if (loading) {
    return (
      <div className="w-full h-[390px] bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[390px] bg-gray-900 rounded-lg flex items-center justify-center text-gray-400">
        {error}
      </div>
    );
  }

  return (
    <div className="video-container w-full rounded-lg overflow-hidden">
      {videoId ? (
        <YouTube videoId={videoId} opts={opts} className="w-full" />
      ) : (
        <div className="w-full h-[390px] bg-gray-900 rounded-lg flex items-center justify-center text-gray-400">
          No trailer available
        </div>
      )}
    </div>
  );
};

export default VideoTrailer;
