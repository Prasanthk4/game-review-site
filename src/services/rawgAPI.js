// services/rawgAPI.js
import axios from 'axios';

const API_KEY = '85adddf9a31649db88b64131b7bcdd6c'; // Use your RAWG API key here
const BASE_URL = 'https://api.rawg.io/api/games';

export const getGamesList = async (page = 1, pageSize = 10, ordering = '') => {
  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&page=${page}&page_size=${pageSize}&ordering=${ordering}`);
  return response.data;
};

export const getGamesByGenre = async (genre, page = 1, pageSize = 10, ordering = '') => {
  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&genres=${genre}&page=${page}&page_size=${pageSize}&ordering=${ordering}`);
  return response.data;
};

export const getGamesByPlatform = async (platformSlug, page = 1, pageSize = 10, ordering = '') => {
  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&platforms=${platformSlug}&page=${page}&page_size=${pageSize}&ordering=${ordering}`);
  return response.data;
};
