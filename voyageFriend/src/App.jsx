import React, { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import logo from "./logo.png";

function App() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showProfile, setShowProfile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const tabs = [
    { name: "hotels", title: "Hotels" },
    { name: "itinerary", title: "Itinerary" },
    { name: "flights", title: "Flights" },
    { name: "splitwise", title: "Splitwise" },
  ];

  return (
    <div className={`app ${showLogin || showSignup ? "blur-background" : ""}`}>
      <div className="header">
        <div className="header-left">
          <img 
            src={logo} 
            alt="Logo" 
            className="logo" 
            onClick={() => setSelectedTab("overview")} 
            style={{ cursor: "pointer" }}
          />
          <p>Voyage Friend</p>
        </div>
        <div className="tabs">
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className={`tab ${selectedTab === tab.name ? "active" : ""}`}
              onClick={() => {
                setSelectedTab(tab.name);
                setShowProfile(false);
              }}
            >
              {tab.title}
            </div>
          ))}
        </div>
        <div className="header-right">
          <p
            className="clickable"
            onClick={() => {
              if (isAuthenticated) {
                setShowProfile(!showProfile);
              } else {
                setShowLogin(true);
              }
            }}
          >
            {isAuthenticated ? "Profile 👤" : "Sign In / Login"}
          </p>
        </div>
      </div>

      {/* Profile Section */}
      {isAuthenticated && showProfile && (
        <motion.div
          className="profile-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Profile Details</h2>
          <ul>
            <li>📖 Previous Itinerary</li>
            <li>🔑 Change Password</li>
            <li>✏️ Update Details</li>
            <li
              className="clickable"
              onClick={() => {
                localStorage.setItem("isLoggedIn", "false");
                setIsAuthenticated(false);
                setShowProfile(false);
              }}
            >
              🚪 Logout
            </li>
          </ul>
        </motion.div>
      )}

      <motion.div
        className="tab-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {selectedTab === "overview" && <p>🌍 Overview content...</p>}
        {selectedTab === "itinerary" && <p>📝 Itinerary details...</p>}
        {selectedTab === "flights" && <p>✈️ Flight information...</p>}
        {selectedTab === "hotels" && <p>🏨 Hotel bookings...</p>}
        {selectedTab === "splitwise" && <p>💰 Expense tracking...</p>}
      </motion.div>

      {showLogin && <LoginPage closeModal={() => setShowLogin(false)} openSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }} 
      />}

      {showSignup && <SignupPage closeModal={() => setShowSignup(false)} openLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }} 
      />}
    </div>
  );
}

export default App;