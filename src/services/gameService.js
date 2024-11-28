import axios from 'axios';

const RAWG_API_KEY = process.env.REACT_APP_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

const gameService = {
  async fetchGames({ page = 1, pageSize = 20, search = '', ordering = '-rating', dates = null, genres = null }) {
    try {
      const params = {
        key: RAWG_API_KEY,
        page,
        page_size: pageSize,
        ordering
      };

      if (search) {
        params.search = search;
        params.search_precise = true;
      }

      if (dates) {
        params.dates = dates;
      }

      if (genres) {
        params.genres = genres;
      }

      const response = await axios.get(`${BASE_URL}/games`, {
        params,
        headers: {
          'Accept': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching games:', error.response || error);
      throw error;
    }
  },

  async getGameDetails(gameId) {
    try {
      const [details, screenshots] = await Promise.all([
        axios.get(`${BASE_URL}/games/${gameId}`, {
          params: { key: RAWG_API_KEY },
          headers: {
            'Accept': 'application/json'
          }
        }),
        axios.get(`${BASE_URL}/games/${gameId}/screenshots`, {
          params: { key: RAWG_API_KEY },
          headers: {
            'Accept': 'application/json'
          }
        })
      ]);

      return {
        ...details.data,
        screenshots: screenshots.data.results
      };
    } catch (error) {
      console.error('Error fetching game details:', error.response || error);
      throw error;
    }
  },

  async getGenres() {
    try {
      const response = await axios.get(`${BASE_URL}/genres`, {
        params: {
          key: RAWG_API_KEY
        },
        headers: {
          'Accept': 'application/json'
        }
      });

      return response.data.results;
    } catch (error) {
      console.error('Error fetching genres:', error.response || error);
      throw error;
    }
  },

  async getNewReleases() {
    const today = new Date();
    const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
    
    return this.fetchGames({
      dates: `${threeMonthsAgo.toISOString().split('T')[0]},${today.toISOString().split('T')[0]}`,
      ordering: '-released'
    });
  },

  async getUpcoming() {
    const today = new Date();
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    
    return this.fetchGames({
      dates: `${today.toISOString().split('T')[0]},${nextYear.toISOString().split('T')[0]}`,
      ordering: 'released'
    });
  },

  async getPopular() {
    return this.fetchGames({
      ordering: '-added'
    });
  },

  async getTopRated() {
    return this.fetchGames({
      ordering: '-rating'
    });
  }
};

export default gameService;
