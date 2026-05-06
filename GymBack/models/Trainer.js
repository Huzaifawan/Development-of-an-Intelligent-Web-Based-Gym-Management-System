const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: String, required: true },
    specialisation: { type: String, required: true },
    bio: { type: String },
    experience: { type: Number }, // years
    contact: { type: String },
    profileImage: { type: String },
    schedule: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        startTime: { type: String },
        endTime: { type: String },
        sessionType: { type: String },
      },
    ],
    gender: { type: String, enum: ["male", "female"], default: "male" },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Trainer", trainerSchema);
