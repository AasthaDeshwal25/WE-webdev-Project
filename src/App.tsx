import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import { PollsPage } from "./pages/PollsPage";
import { RecommendationsPage } from "./RecommendationsPage";
import CreateTrip from "./CreateTrip.tsx";
import {Itinerary} from "./Itinerary"; 
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import { User } from "lucide-react";

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to Voyage Friend</h1>
      <p className="mt-4 text-gray-600">
        Plan your trips, vote on destinations, and get recommendations!
      </p>
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
      const timer = setTimeout(() => setShowLogin(true), 5000); // Reduced wait time
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="relative flex">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-full z-50">
          <Sidebar />
        </div>

        {/* Profile Button */}
        <div className="fixed top-4 right-4 z-50">
          <button
            className="flex items-center space-x-2 bg-gray-100 p-2 rounded-full shadow hover:bg-gray-200"
            onClick={() => setShowProfile(!showProfile)}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 transition-all duration-300">            
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/polls" element={<PollsPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/itinerary" element={<Itinerary />} /> 
            <Route path="/create-trip" element={<CreateTrip />} />
          </Routes>
        </main>
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
