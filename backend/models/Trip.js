const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
    name: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] } // ✅ Ensure this is an array
});

module.exports = mongoose.model("Trip", TripSchema);
