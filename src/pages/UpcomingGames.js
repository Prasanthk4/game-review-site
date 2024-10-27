import React, { useEffect, useState } from "react";

const UpcomingGames = () => {
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchUpcomingGames = async () => {
      const clientId = "v3swybskwxfymqtna9uhk3q44ag9ga"; // Your Client ID
      const clientSecret = "rn9bdjvh273dsh7zdx4f0ckhc7xydi"; // Your Client Secret

      try {
        // Get the access token
        const tokenResponse = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
          method: "POST",
        });
        
        if (!tokenResponse.ok) {
          throw new Error('Failed to fetch access token');
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Fetch upcoming games
        const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
          method: "POST",
          headers: {
            "Client-ID": clientId,
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fields: "*", // Adjust fields as necessary
            where: "release_dates.date > now()", // Filter for upcoming games
            order: "release_dates.date asc",
            limit: 10
          }),
        });

        if (!gamesResponse.ok) {
          throw new Error('Failed to fetch upcoming games');
        }

        const gamesData = await gamesResponse.json();
        setUpcomingGames(gamesData);
      } catch (err) {
        setError(err.message); // Update error state
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingGames();
  }, []);

  if (loading) return <div>Loading upcoming games...</div>;
  if (error) return <div>Error: {error}</div>; // Display error message

  return (
    <div>
      <h1>Upcoming Games</h1>
      <ul>
        {upcomingGames.map((game) => (
          <li key={game.id}>
            {game.name} - Release Date: {new Date(game.release_dates[0].date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingGames;
