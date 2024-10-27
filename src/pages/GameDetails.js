import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RAWG_API_KEY = "85adddf9a31649db88b64131b7bcdd6c"; // Your RAWG API key
const YOUTUBE_API_KEY = "AIzaSyBUX8S6UHguUIVc2cIT2Gt5imMOKK7NIqo"; // Your YouTube API key
const BASE_URL = "https://api.rawg.io/api";
const YOUTUBE_URL = "https://www.googleapis.com/youtube/v3/search";

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [ignReview, setIgnReview] = useState(null);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(3);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/games/${id}?key=${RAWG_API_KEY}`);
        setGame(response.data);
        fetchYouTubeTrailer(response.data.name); 
        fetchIGNReview(response.data.name); 

        // Load saved user rating from local storage
        const savedRating = localStorage.getItem(`rating_${id}`);
        if (savedRating) {
          setUserRating(parseInt(savedRating, 10));
        }
      } catch (err) {
        setError("Failed to fetch game details. Please try again later.");
      }
    };

    const fetchYouTubeTrailer = async (gameName) => {
      try {
        const response = await axios.get(YOUTUBE_URL, {
          params: {
            part: "snippet",
            q: `${gameName} trailer`,
            key: YOUTUBE_API_KEY,
            maxResults: 1, 
          },
        });
        
        console.log("YouTube trailer response:", response.data); // Debug log
        const video = response.data.items[0];
        
        if (video) {
          setTrailer(video);
        } else {
          console.log("No trailer found.");
        }
      } catch (err) {
        console.error("Failed to fetch YouTube trailer:", err);
      }
    };

    const fetchIGNReview = async (gameName) => {
      try {
        const response = await axios.get(YOUTUBE_URL, {
          params: {
            part: "snippet",
            q: `IGN ${gameName} review`,
            key: YOUTUBE_API_KEY,
            maxResults: 1, 
          },
        });

        console.log("YouTube IGN review response:", response.data); 
        const video = response.data.items[0];
        
        if (video) {
          setIgnReview(video); 
        } else {
          console.log("No IGN review found.");
        }
      } catch (err) {
        console.error("Failed to fetch IGN review:", err);
      }
    };

    fetchGameDetails();
  }, [id]);

  const handleRatingChange = (event) => {
    const newRating = parseInt(event.target.value, 10);
    setUserRating(newRating);
    // Save the rating to local storage
    localStorage.setItem(`rating_${id}`, newRating);
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!game) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-extrabold mb-4" style={{ color: "#c8140a" }}>{game.name}</h1>
      
      {/* Game Trailer Section */}
      <div className="flex mb-4">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-1/2 h-auto object-cover mb-4 mr-4"
        />
        {trailer ? (
          <div className="w-1/2 h-auto">
            <h2 className="text-xl font-bold mb-2" style={{ color: "#c8140a" }}>Game Trailer</h2>
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${trailer.id.videoId}?autoplay=1`} 
              title={`Trailer for ${game.name}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div>No trailer available for this game.</div>
        )}
      </div>

      {/* IGN Review Section */}
      <div className="flex mb-20">
        {ignReview ? (
          <div className="w-full h-auto">
            <h2 className="text-xl font-bold mb-2" style={{ color: "#c8140a" }}>IGN Review</h2>
            <iframe
              width="50%"
              height="315"
              src={`https://www.youtube.com/embed/${ignReview.id.videoId}`} 
              title={`IGN Review for ${game.name}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div>No IGN review available for this game.</div>
        )}
      </div>

      <div className="mb-10">
        <h2 className="text-2xl  font-bold text-center" style={{ color: "#c8140a" }}>Rate this Game</h2>
        <div className="flex justify-center mt-2">
          <div className="rating">
            <input 
              value="5" 
              name="rate" 
              id="star5" 
              type="radio" 
              checked={userRating === 5}
              onChange={handleRatingChange} 
            />
            <label title="text" htmlFor="star5"></label>
            <input 
              value="4" 
              name="rate" 
              id="star4" 
              type="radio" 
              checked={userRating === 4}
              onChange={handleRatingChange} 
            />
            <label title="text" htmlFor="star4"></label>
            <input 
              value="3" 
              name="rate" 
              id="star3" 
              type="radio" 
              defaultChecked={userRating === 3}
              onChange={handleRatingChange} 
            />
            <label title="text" htmlFor="star3"></label>
            <input 
              value="2" 
              name="rate" 
              id="star2" 
              type="radio" 
              checked={userRating === 2}
              onChange={handleRatingChange} 
            />
            <label title="text" htmlFor="star2"></label>
            <input 
              value="1" 
              name="rate" 
              id="star1" 
              type="radio" 
              checked={userRating === 1}
              onChange={handleRatingChange} 
            />
            <label title="text" htmlFor="star1"></label>
          </div>
        </div>
      </div>

      <p className="text-lg mb-2"><strong>Release Date:</strong> {game.released}</p>
      <p className="text-lg mb-2"><strong>Average Playtime:</strong> {game.playtime ? `${game.playtime} hours` : "N/A"}</p>
      <p className="text-lg mb-2"><strong>Developer:</strong> {game.developers.map(dev => dev.name).join(", ")}</p>
      <p className="text-lg mb-2"><strong>Publisher:</strong> {game.publishers.map(pub => pub.name).join(", ")}</p>
      <p className="text-lg mb-2"><strong>Genres:</strong> {game.genres.map(genre => genre.name).join(", ")}</p>
      <p className="text-lg mb-2"><strong>Tags:</strong> {game.tags.map(tag => tag.name).join(", ")}</p>
      <p className="text-lg mb-2"><strong>Platforms:</strong> {game.platforms.map(platform => platform.platform.name).join(", ")}</p>
      <p className="text-lg mb-2"><strong>Age Rating:</strong> {game.esrb_rating ? game.esrb_rating.name : "N/A"}</p>

      <h2 className="text-2xl font-bold mt-4">About</h2>
      <p className="mb-4">{game.description_raw}</p>

      <h3 className="text-lg font-bold">User Ratings</h3>
      <p><strong>Average Rating:</strong> {game.rating ? `${game.rating} / 100` : "N/A"}</p>
      <p><strong>Rating Count:</strong> {game.ratings_count}</p>
      <p><strong>Rank:</strong> {game.ranked ? `#${game.ranked}` : "N/A"}</p>
    </div>
  );
};

export default GameDetails;
