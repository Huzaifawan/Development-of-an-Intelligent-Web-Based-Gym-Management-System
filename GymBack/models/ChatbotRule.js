const mongoose = require("mongoose");

const chatbotRuleSchema = new mongoose.Schema(
  {
    keywords: [{ type: String, required: true }],
    response: { type: String, required: true },
    context: {
      type: String,
      enum: ["membership", "schedule", "trainer", "general", "pricing", "facilities"],
      default: "general",
    },
    priority: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatbotRule", chatbotRuleSchema);
