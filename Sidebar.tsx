import React, { useState, useRef } from "react";
import { Home, Vote, MapPin, Calendar, CloudSun, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "./logo.png";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle hover effects with a delay before collapsing
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
      className={`fixed left-0 top-16 h-screen bg-gray-900 bg-opacity-60 shadow-lg backdrop-blur-md transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      } hover:bg-opacity-80 hover:shadow-xl`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo Section */}
      
      {/* Navigation Links */}
      <nav className="flex flex-col space-y-4 mt-4 px-2">
        <SidebarItem to="/" icon={<Home />} label="Home" isExpanded={isExpanded} />
        <SidebarItem to="/polls" icon={<Vote />} label="Polls" isExpanded={isExpanded} />
        <SidebarItem to="/recommendations" icon={<MapPin />} label="Recommendations" isExpanded={isExpanded} />
        <SidebarItem to="/itinerary" icon={<Calendar />} label="Itinerary" isExpanded={isExpanded} />
        <SidebarItem to="/weather" icon={<CloudSun />} label="Weather" isExpanded={isExpanded} />
        <SidebarItem to="/expenses" icon={<Wallet />} label="Expenses" isExpanded={isExpanded} />
      </nav>
    </aside>
  );
};

const SidebarItem = ({ to, icon, label, isExpanded }) => (
  <Link
    to={to}
    className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-md transition-all duration-300 text-white"
  >
    {icon}
    {isExpanded && <span className="text-base">{label}</span>}
  </Link>
);

export default Sidebar;
