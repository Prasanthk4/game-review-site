import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import MainPage from './pages/MainPage';
import AnimeMangaPage from './pages/AnimeMangaPage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import GamesPage from './pages/GamesPage';
import GameDetails from './pages/GameDetails';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FavoriteGames from './pages/FavoriteGames';
import { UserProvider } from "./services/UserContext";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/anime" element={<AnimeMangaPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/favorites" element={<FavoriteGames />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
