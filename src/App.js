import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GameDetails from "./pages/GameDetails";
import Search from "./pages/Search";
import UpcomingGames from "./pages/UpcomingGames";
import MainPage from "./pages/MainPage";
import Login from "./services/Login"; 
import SignUp from "./services/SignUp";
import { UserProvider } from "./services/UserContext"; 

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} /> 
          <Route path="/home" element={<Home />} />
          <Route path="/home/wishlist" element={<Home filter="wishlist" />} /> 
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/upcoming-games" element={<UpcomingGames />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
