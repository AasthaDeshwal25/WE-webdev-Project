import React, { useState, useRef } from "react";
import { Home, Vote, MapPin, Calendar, CloudSun, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "./logo.png";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hoverTimeout = useRef(null);

  // Handle hover with a delay before collapsing
  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsExpanded(false);
    }, 2000); // 2-second delay before collapsing
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gray-50 shadow-lg transition-all duration-300 ${
        isExpanded ? "w-64 bg-opacity-90" : "w-16 bg-opacity-50"
      } backdrop-blur-md hover:bg-opacity-100 hover:shadow-xl`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo Section */}
      <div className="flex items-center space-x-3 p-4">
        <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
        {isExpanded && (
          <span className="text-lg font-bold text-gray-700">Voyage Friend</span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-4 mt-4 px-2">
        <SidebarItem to="/" icon={<Home />} label="Home" isExpanded={isExpanded} />
        <SidebarItem to="/polls" icon={<Vote />} label="Polls" isExpanded={isExpanded} />
        <SidebarItem to="/recommendations" icon={<MapPin />} label="Recommendations" isExpanded={isExpanded} />
        <SidebarItem to="/itinerary" icon={<Calendar />} label="Itinerary" isExpanded={isExpanded} />
        
        {/* Weather */}
        <SidebarItem to="/weather" icon={<CloudSun />} label="Weather" isExpanded={isExpanded} />
        
        {/* Expense Tracker */}
        <SidebarItem to="/expenses" icon={<Wallet />} label="Expenses" isExpanded={isExpanded} />
      </nav>
    </aside>
  );
};

const SidebarItem = ({ to, icon, label, isExpanded }) => (
  <Link
    to={to}
    className="flex items-center space-x-3 p-2 hover:bg-gray-200 rounded-md transition-all duration-300"
  >
    {icon}
    {isExpanded && <span className="text-base">{label}</span>}
  </Link>
);

export default Sidebar;
