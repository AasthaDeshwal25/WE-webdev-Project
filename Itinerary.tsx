import React, { useState, useEffect } from "react";
import { Plus, Users, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Trip {
  id: string;
  title: string;
  description: string;
  date: string;
}

export function Itinerary() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem("trips") || "[]");
    setTrips(storedTrips);
  }, []);

  const handleDeleteTrip = (id: string) => {
    const updatedTrips = trips.filter((trip) => trip.id !== id);
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Itinerary</h1>
        <div className="flex justify-center gap-4 mb-8">
          <Link to="/create-trip">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="w-5 h-5 mr-2 inline" /> Create
            </button>
          </Link>

          
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Trips</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.length > 0 ? (
            trips.map((trip) => (
              <div key={trip.id} className="bg-white shadow-md rounded-lg p-4 relative">
                <h3 className="text-lg font-semibold text-gray-900">{trip.title}</h3>
                <p className="text-gray-600">{trip.description}</p>
                <p className="text-sm text-gray-500">Date: {trip.date}</p>
                <p className="text-sm text-gray-400 mt-2">Trip ID: {trip.id}</p>
                <button
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                  onClick={() => handleDeleteTrip(trip.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No trips found. Create one now!</p>
          )}
        </div>
      </div>
    </div>
  );
}
