import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, BarChart2, Plus } from "lucide-react";

const generateUniqueTripId = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const existingTrips = JSON.parse(localStorage.getItem("trips") || "[]");
  let tripId;
  do {
    tripId = Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join("");
  } while (existingTrips.some((trip) => trip.id === tripId));
  return tripId;
};

const interestOptions = [
  "Must-see Attractions",
  "Great Food",
  "Hidden Gems",
  "French wine & gourmet delights",
  "Parisian cabaret shows",
  "Montmartre art & culture",
  "French Cuisine",
  "Art Museums",
  "Historical Landmarks",
  "Luxury Shopping",
  "River Seine Cruise",
  "French Bakeries and Patisseries",
];

const CreateTrip = () => {
  const [trip, setTrip] = useState({
    destination: "",
    date: "",
    month: "",
    duration: "",
    travelers: "Solo",
    pets: "No",
    children: "No",
  });
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [error, setError] = useState(null);
  const [interests, setInterests] = useState([]);
  const [customInterest, setCustomInterest] = useState("");
  const [showAddInterestModal, setShowAddInterestModal] = useState(false);
  const navigate = useNavigate();

  const handleCreateTrip = () => {
    if (!trip.destination || (!flexibleDates && !trip.date) || (flexibleDates && !trip.month) || !trip.duration) {
      setError("Please fill out all required fields!");
      return;
    }
    if (interests.length < 3) {
      setError("Please select at least 3 interests!");
      return;
    }
    const newTrip = {
      id: generateUniqueTripId(),
      title: trip.destination,
      description: `A ${trip.duration}-day trip`,
      date: flexibleDates ? `Flexible: ${trip.month}` : trip.date,
      travelers: trip.travelers,
      pets: trip.pets,
      children: trip.children,
      interests,
    };
    const existingTrips = JSON.parse(localStorage.getItem("trips") || "[]");
    localStorage.setItem("trips", JSON.stringify([...existingTrips, newTrip]));
    navigate("/itinerary");
  };

  const toggleInterest = (interest) => {
    setInterests((prevInterests) =>
      prevInterests.includes(interest)
        ? prevInterests.filter((i) => i !== interest)
        : [...prevInterests, interest]
    );
  };

  const handleAddCustomInterest = () => {
    if (customInterest && !interests.includes(customInterest)) {
      setInterests([...interests, customInterest]);
      setCustomInterest("");
      setShowAddInterestModal(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create New Trip</h2>

        <label className="block mb-4">
          <span className="text-lg font-medium">Where to? (City or Town)</span>
          <input
            type="text"
            placeholder="Enter destination"
            className="w-full px-4 py-3 mt-2 border rounded-lg"
            value={trip.destination}
            onChange={(e) => setTrip({ ...trip, destination: e.target.value })}
          />
        </label>

        <label className="block mb-4">
          <span className="text-lg font-medium">Do you know your exact dates?</span>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={flexibleDates}
              onChange={() => setFlexibleDates(!flexibleDates)}
            />
            I don’t know my exact dates
          </label>
        </label>

        {!flexibleDates ? (
          <label className="block mb-4">
            <span className="text-lg font-medium">When are you going?</span>
            <input
              type="date"
              className="w-full px-4 py-3 mt-2 border rounded-lg"
              value={trip.date}
              onChange={(e) => setTrip({ ...trip, date: e.target.value })}
            />
          </label>
        ) : (
          <label className="block mb-4">
            <span className="text-lg font-medium">Select the month</span>
            <select
              className="w-full px-4 py-3 mt-2 border rounded-lg"
              value={trip.month}
              onChange={(e) => setTrip({ ...trip, month: e.target.value })}
            >
              <option value="">Select Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>
        )}

        <label className="block mb-4">
          <span className="text-lg font-medium">How long is your trip? (in days)</span>
          <input
            type="number"
            placeholder="Duration (days)"
            className="w-full px-4 py-3 mt-2 border rounded-lg"
            value={trip.duration}
            onChange={(e) => setTrip({ ...trip, duration: e.target.value })}
          />
        </label>

        <label className="block mb-4">
          <span className="text-lg font-medium">Interests</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                className={`px-4 py-2 rounded-lg border text-sm ${
                  interests.includes(interest)
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
            {interests
              .filter((interest) => !interestOptions.includes(interest))
              .map((custom) => (
                <button
                  key={custom}
                  className="px-4 py-2 rounded-lg border text-sm bg-green-500 text-white border-green-500"
                >
                  {custom}
                </button>
              ))}
            <button
              className="px-4 py-2 rounded-lg border bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => setShowAddInterestModal(true)}
            >
              <Plus className="w-4 h-4 inline" /> Add Interest
            </button>
          </div>
        </label>

        {showAddInterestModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Add other interests</h3>
              <input
                type="text"
                placeholder="Enter additional interests"
                className="w-full px-4 py-2 border rounded-lg mb-4"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => setShowAddInterestModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                  onClick={handleAddCustomInterest}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <label className="block mb-4">
          <span className="text-lg font-medium">What kind of trip are you planning?</span>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {[
              { value: "Solo", label: "Solo Trip" },
              { value: "With Partner", label: "Partner Trip" },
              { value: "Friends", label: "Friends Trip" },
              { value: "Family", label: "Family Trip" },
            ].map((option) => (
              <button
                key={option.value}
                className={`w-full px-4 py-3 text-center rounded-lg border ${
                  trip.travelers === option.value
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setTrip({ ...trip, travelers: option.value })}
              >
                {option.label}
              </button>
            ))}
          </div>
        </label>

        {(trip.travelers === "Solo" || trip.travelers === "Friends" || trip.travelers === "Family") && (
          <label className="block mb-4">
            <span className="text-lg font-medium">Are you going with pets?</span>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {["Yes", "No"].map((option) => (
                <button
                  key={option}
                  className={`w-full px-4 py-3 text-center rounded-lg border ${
                    trip.pets === option
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => setTrip({ ...trip, pets: option })}
                >
                  {option}
                </button>
              ))}
            </div>
          </label>
        )}

        {(trip.travelers === "Friends" || trip.travelers === "Family") && (
          <label className="block mb-4">
            <span className="text-lg font-medium">Are you going with children?</span>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {["Yes", "No"].map((option) => (
                <button
                  key={option}
                  className={`w-full px-4 py-3 text-center rounded-lg border ${
                    trip.children === option
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => setTrip({ ...trip, children: option })}
                >
                  {option}
                </button>
              ))}
            </div>
          </label>
        )}

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="flex justify-between">
          <button
            onClick={handleCreateTrip}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-5 h-5" />
            Create Trip
          </button>
          <button
            onClick={() => navigate("/polls")}
            className="flex items-center gap-2 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 transition"
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
