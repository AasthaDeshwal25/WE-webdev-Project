import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import { PollsPage } from "./pages/PollsPage";
import { RecommendationsPage } from "./RecommendationsPage";
import CreateTrip from "./CreateTrip.tsx";
import { Itinerary } from "./Itinerary";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import WeatherPage from "./WeatherPage";
import { User } from "lucide-react";
import logo from "./logo.png";
import backgroundVideo from "./background.mp4";

function HomePage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-6">
        <h1 className="text-5xl font-extrabold drop-shadow-lg">Welcome to Voyage Friend</h1>
        <p className="mt-4 text-lg opacity-90">Plan your trips, vote on destinations, and get recommendations!</p>
        <button className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all">
          Get Started
        </button>
      </div>
    </div>
  );
}

function App() {
  const [showProfile, setShowProfile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => setShowLogin(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <header className="fixed top-0 left-0 w-full bg-white shadow-md flex justify-between items-center px-6 py-3 z-50">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-xl font-bold text-gray-900">Voyage Friend</h1>
        </div>
        {isAuthenticated ? (
          <div className="relative">
            <button
              className="flex items-center space-x-2 bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300"
              onClick={() => setShowProfile(!showProfile)}
            >
              <User className="w-5 h-5 text-gray-700" />
              <span className="text-gray-900">Profile</span>
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg">
                <button onClick={handleLogout} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-4">
            <button onClick={() => setShowLogin(true)} className="px-4 py-2 bg-blue-500 text-white rounded">Login</button>
            <button onClick={() => setShowSignup(true)} className="px-4 py-2 bg-green-500 text-white rounded">Sign Up</button>
          </div>
        )}
      </header>

      <div className="relative flex">
        <div className="fixed top-16 left-0 h-full z-50">
          <Sidebar />
        </div>
        <div className="h-screen w-screen flex flex-col">
          <div className="flex flex-1 overflow-hidden">
            <div className="fixed top-16 left-0 z-50">
              <Sidebar />
            </div>
            <main className="flex-1 h-full overflow-auto pt-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/polls" element={<PollsPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/itinerary" element={<Itinerary />} />
                <Route path="/create-trip" element={<CreateTrip />} />
                <Route path="/weather" element={<WeatherPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>

      {showLogin && (
        <LoginPage
          closeModal={() => setShowLogin(false)}
          openSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}
      {showSignup && (
        <SignupPage
          closeModal={() => setShowSignup(false)}
          openLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
    </Router>
  );
}

export default App;
