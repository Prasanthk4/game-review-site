// services/igdbAPI.js

import axios from 'axios';

const CLIENT_ID = 'v3swybskwxfymqtna9uhk3q44ag9ga';
const CLIENT_SECRET = 'rn9bdjvh273dsh7zdx4f0ckhc7xydi';
const BASE_URL = 'https://api.igdb.com/v4';
const TOKEN_URL = 'https://id.twitch.tv/oauth2/token';

let accessToken = '';

const getAccessToken = async () => {
  try {
    const response = await axios.post(TOKEN_URL, null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
    });
    
    accessToken = response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
  }
};

const fetchUpcomingGames = async () => {
  if (!accessToken) {
    await getAccessToken();
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/games`,
      'fields *; where release_dates.date > 0 & release_dates.date < 9999999999; sort release_dates.date asc;',
      {
        headers: {
          'Client-ID': CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'text/plain',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    return [];
  }
};

export { fetchUpcomingGames };
