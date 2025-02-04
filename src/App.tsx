import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { PollsPage } from './pages/PollsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { MapPin, Vote } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                <img src="/logo.png" alt="logo" className="w-10 h-10 rounded-full mr-3 object-cover"/>
                  <span className="text-xl font-bold text-blue-600">
                    Voyage Friend
                  </span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/polls"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
                  >
                    <Vote className="w-5 h-5 mr-2" />
                    Polls
                  </Link>
                  <Link
                    to="/recommendations"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    Recommendations
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<PollsPage />} />
            <Route path="/polls" element={<PollsPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;