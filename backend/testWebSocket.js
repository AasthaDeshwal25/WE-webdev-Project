const io = require("socket.io-client");

const socket = io("http://localhost:5000", {
  transports: ["websocket"],  // Force WebSocket transport
});

socket.on("connect", () => {
  console.log("Connected to WebSocket server");

  socket.emit("updateItinerary", {
    tripId: "trip_id_here",
    updates: { destination: "Goa Beach" },
  });
});

socket.on("itineraryUpdated", (data) => {
  console.log("Received itinerary update:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("connect_error", (err) => {
  console.log("Connection error:", err);
});
