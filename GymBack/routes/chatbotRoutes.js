const express = require("express");
const router = express.Router();
const {
  processMessage,
  getChatbotRules,
  addChatbotRule,
  updateChatbotRule,
  deleteChatbotRule,
} = require("../controllers/chatbotController");
const { protect, authorise } = require("../middleware/authMiddleware");

// Public chatbot message endpoint
router.post("/message", processMessage);

// Admin rule management
router.get("/rules", protect, authorise("admin"), getChatbotRules);
router.post("/rules", protect, authorise("admin"), addChatbotRule);
router.put("/rules/:id", protect, authorise("admin"), updateChatbotRule);
router.delete("/rules/:id", protect, authorise("admin"), deleteChatbotRule);

module.exports = router;
