const API_KEY = '40a4b39c04c2dabba3025cab39c82221';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Using API key in the URL as a fallback since some endpoints might not accept Bearer token
const getUrl = (endpoint, params = {}) => {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params
  }).toString();
  return `${BASE_URL}${endpoint}?${queryParams}`;
};

const headers = {
  'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MGE0YjM5YzA0YzJkYWJiYTMwMjVjYWIzOWM4MjIyMSIsInN1YiI6IjY1NGJmOWQ5MjkzODM1MDEzOTI5MzJhZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cGLvxFweiYvzF4kHQxkwgH3qw9X3dGqyLWhNMH5n9nk`,
  'Content-Type': 'application/json'
};

export const movieService = {
  getImageUrl: (path, size = 'w500') => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  getTrendingMovies: async (page = 1, sortBy = 'popularity.desc') => {
    try {
      let url;
      // Get current date and date from 6 months ago
      const currentDate = new Date().toISOString().split('T')[0];
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0];

      switch (sortBy) {
        case 'popularity.desc':
          url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}&include_adult=false`;
          break;
        case 'release_date.desc':
          // Show movies released in the last 6 months
          url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=release_date.desc&page=${page}&include_adult=false&release_date.lte=${currentDate}&release_date.gte=${sixMonthsAgoStr}&with_release_type=2|3`;
          break;
        case 'vote_average.desc':
          url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=vote_average.desc&vote_count.gte=100&page=${page}&include_adult=false`;
          break;
        case 'original_title.asc':
          url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=original_title.asc&page=${page}&include_adult=false`;
          break;
        default:
          url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}&include_adult=false`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch movies');
      const data = await response.json();

      return {
        ...data,
        results: data.results.map(movie => ({
          ...movie,
          poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
          backdrop_url: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null
        }))
      };
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  searchMovies: async (query, page = 1, sortBy = 'popularity.desc') => {
    try {
      // First get search results
      const searchUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) throw new Error('Failed to search movies');
      const searchData = await searchResponse.json();

      // Get movie details for sorting
      const movieIds = searchData.results.map(movie => movie.id);
      const detailsPromises = movieIds.map(id => 
        fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`).then(res => res.json())
      );
      
      const moviesWithDetails = await Promise.all(detailsPromises);

      // Sort results based on sortBy parameter
      let sortedResults = [...moviesWithDetails];
      switch (sortBy) {
        case 'popularity.desc':
          sortedResults.sort((a, b) => b.popularity - a.popularity);
          break;
        case 'release_date.desc':
          sortedResults.sort((a, b) => {
            if (!a.release_date) return 1;
            if (!b.release_date) return -1;
            return new Date(b.release_date) - new Date(a.release_date);
          });
          break;
        case 'vote_average.desc':
          sortedResults.sort((a, b) => b.vote_average - a.vote_average);
          break;
        case 'original_title.asc':
          sortedResults.sort((a, b) => {
            const titleA = a.title?.toLowerCase() || '';
            const titleB = b.title?.toLowerCase() || '';
            return titleA.localeCompare(titleB);
          });
          break;
      }

      return {
        ...searchData,
        results: sortedResults.map(movie => ({
          ...movie,
          poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
          backdrop_url: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null
        }))
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  getMovieDetails: async (movieId) => {
    try {
      const [details, credits, videos, similar, recommendations] = await Promise.all([
        fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`).then(res => res.json()),
        fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`).then(res => res.json()),
        fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`).then(res => res.json()),
        fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`).then(res => res.json()),
        fetch(`${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}`).then(res => res.json())
      ]);

      return {
        ...details,
        poster_url: details.poster_path ? `${IMAGE_BASE_URL}/w500${details.poster_path}` : null,
        backdrop_url: details.backdrop_path ? `${IMAGE_BASE_URL}/original${details.backdrop_path}` : null,
        cast: credits.cast || [],
        videos: videos.results || [],
        similar: similar.results || [],
        recommendations: recommendations.results || []
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }
};

export default movieService;
