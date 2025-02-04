import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, BarChart2 } from "lucide-react";

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "AUD", symbol: "A$" },
  { code: "CAD", symbol: "C$" },
];

const generateUniqueTripId = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const existingTrips = JSON.parse(localStorage.getItem("trips") || "[]");
  
  let tripId;
  do {
    tripId = Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join("");
  } while (existingTrips.some((trip: any) => trip.id === tripId));

  return tripId;
};

const CreateTrip = () => {
  const [trip, setTrip] = useState({
    destination: "",
    date: "",
    duration: "",
    budget: "Low",
    travelers: "Solo",
    activities: [],
    dietary: "",
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreateTrip = () => {
    if (!trip.destination || !trip.date || !trip.duration) {
      setError("Please fill out all required fields!");
      return;
    }

    const newTrip = {
      id: generateUniqueTripId(),
      title: trip.destination,
      description: `A ${trip.duration}-day trip`,
      date: trip.date,
      budget: trip.budget,
      travelers: trip.travelers,
      activities: trip.activities,
      dietary: trip.dietary,
    };

    const existingTrips = JSON.parse(localStorage.getItem("trips") || "[]");
    localStorage.setItem("trips", JSON.stringify([...existingTrips, newTrip]));

    navigate("/itinerary");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Create New Trip</h2>

        <input
          type="text"
          placeholder="Enter destination"
          className="w-full px-4 py-2 mb-3 border rounded-lg"
          value={trip.destination}
          onChange={(e) => setTrip({ ...trip, destination: e.target.value })}
        />

        <input
          type="date"
          className="w-full px-4 py-2 mb-3 border rounded-lg"
          value={trip.date}
          onChange={(e) => setTrip({ ...trip, date: e.target.value })}
        />

        <input
          type="number"
          placeholder="Duration (days)"
          className="w-full px-4 py-2 mb-3 border rounded-lg"
          value={trip.duration}
          onChange={(e) => setTrip({ ...trip, duration: e.target.value })}
        />

        <select
          className="w-full px-4 py-2 mb-3 border rounded-lg"
          value={trip.budget}
          onChange={(e) => setTrip({ ...trip, budget: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select
          className="w-full px-4 py-2 mb-3 border rounded-lg"
          value={trip.travelers}
          onChange={(e) => setTrip({ ...trip, travelers: e.target.value })}
        >
          <option>Solo</option>
          <option>Couple</option>
          <option>Family</option>
          <option>Friends</option>
        </select>

        <div className="mb-3">
          <label className="block mb-2">Activity Preferences:</label>
          <div className="flex flex-wrap gap-2">
            {["Beaches", "Sightseeing", "Hiking"].map((activity) => (
              <label key={activity} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={activity}
                  checked={trip.activities.includes(activity)}
                  onChange={(e) => {
                    const selected = e.target.checked
                      ? [...trip.activities, activity]
                      : trip.activities.filter((a) => a !== activity);
                    setTrip({ ...trip, activities: selected });
                  }}
                />
                {activity}
              </label>
            ))}
          </div>
        </div>

        <select
          className="w-full px-4 py-2 mb-3 border rounded-lg"
          value={trip.dietary}
          onChange={(e) => setTrip({ ...trip, dietary: e.target.value })}
        >
          <option value="">Dietary Preference</option>
          <option>Halal</option>
          <option>Vegetarian</option>
        </select>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <div className="flex justify-between">
          <button
            onClick={handleCreateTrip}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-5 h-5" />
            Create Trip
          </button>

          <button
            onClick={() => navigate("/polls")}
            className="flex items-center gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            <BarChart2 className="w-5 h-5" />
            Polls
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
