const express = require("express");
const mongoose = require("mongoose");
const Trip = require("../models/Trip");
const User = require("../models/User"); 
const authMiddleware = require("../middleware/auth");
const protect = require("../middleware/auth");

const router = express.Router();

// CREATE A NEW TRIP (Protected Route)
router.post("/", protect, async (req, res) => {
    try {
      const { name, destination, startDate, endDate } = req.body;
  
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized: No user attached" });
      }
  
      const trip = new Trip({
        name,
        destination,
        startDate,
        endDate,
        createdBy: req.user._id, // ✅ This should be set
      });
  
      await trip.save();
      res.status(201).json(trip);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

// GET ALL TRIPS
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find().populate("createdBy", "name email");
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET A SINGLE TRIP BY ID (Validate MongoDB ID)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Trip ID" });
  }

  try {
    const trip = await Trip.findById(id).populate("createdBy", "name email");
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// UPDATE A TRIP (Protected Route)
router.put("/:id", protect, async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id);
  
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
  
      // Check if the user updating the trip is the creator
      if (trip.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized: You are not the creator of this trip" });
      }
  
      // Update trip details
      Object.assign(trip, req.body);
      await trip.save();
  
      res.status(200).json(trip);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
// DELETE A TRIP (Protected Route)
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Trip ID" });
  }

  try {
    const deletedTrip = await Trip.findByIdAndDelete(id);
    if (!deletedTrip) return res.status(404).json({ message: "Trip not found" });

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ADD PARTICIPANT TO TRIP 
router.put("/:tripId/add-participant", protect, async (req, res) => {
    try {
        const { userId } = req.body;
        const { tripId } = req.params;

        // Fetch the trip
        const trip = await Trip.findById(tripId);

        // Check if the trip exists
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        // Ensure `participants` field exists (for safety)
        if (!trip.participants) {
            trip.participants = [];
        }

        // Only the creator of the trip can add participants
        if (trip.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to add participants" });
        }

        // Check if the user is already a participant
        if (trip.participants.includes(userId)) {
            return res.status(400).json({ message: "User is already a participant" });
        }

        // Add the user to participants
        trip.participants.push(userId);
        await trip.save();

        res.status(200).json({
            message: "Participant added successfully",
            trip,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// REMOVE PARTICIPANT FROM TRIP 
router.put("/:tripId/remove-participant", protect, async (req, res) => {
    try {
        const { userId } = req.body;
        const { tripId } = req.params;

        // Fetch the trip
        const trip = await Trip.findById(tripId);

        // Check if the trip exists
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        // Ensure `participants` field exists
        if (!trip.participants) {
            trip.participants = [];
        }

        // Only the creator can remove participants
        if (trip.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to remove participants" });
        }

        // Check if the user is actually a participant
        if (!trip.participants.includes(userId)) {
            return res.status(400).json({ message: "User is not a participant" });
        }

        // Remove the user from participants
        trip.participants = trip.participants.filter(id => id.toString() !== userId);
        await trip.save();

        res.status(200).json({
            message: "Participant removed successfully",
            trip,
        });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
