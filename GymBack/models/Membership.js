const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planType: {
      type: String,
      enum: ["basic", "standard", "premium"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    features: [{ type: String }],
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// ✅ Indexes for frequently queried fields
// Speeds up: findOne({ user, status }) used in getMyMembership and createMembership
membershipSchema.index({ user: 1, status: 1 });
// Speeds up: admin dashboard countDocuments({ status })
membershipSchema.index({ status: 1 });
// Speeds up: revenue aggregation on paymentStatus
membershipSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model("Membership", membershipSchema);
