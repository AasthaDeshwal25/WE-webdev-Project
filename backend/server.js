require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");  //Required for WebSockets
const { Server } = require("socket.io");  //WebSocket server

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/trip_planner")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

mongoose.connection.on("error", (err) => {
  console.error("MongoDB Connection Error:", err);
});

// Routes
const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trip");

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

// Test route
app.get("/", (req, res) => {
  res.send(" Backend is running...");
});

// Create HTTP server for WebSockets
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // Allow all origins
});

// WebSocket event handling
io.on("connection", (socket) => {
  console.log(`WebSocket Connected: ${socket.id}`);

  socket.on("updateItinerary", (data) => {
    console.log("Received updateItinerary event:", data);

    // Broadcast the update to all clients
    io.emit("itineraryUpdated", data);
  });

  socket.on("disconnect", () => {
    console.log(`WebSocket Disconnected: ${socket.id}`);
  });
});

// Start HTTP + WebSocket server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
