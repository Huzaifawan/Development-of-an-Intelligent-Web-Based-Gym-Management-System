const express = require("express");
const router = express.Router();
const {
  bookSession,
  getMySessions,
  cancelSession,
  getAllSessions,
} = require("../controllers/sessionController");
const { protect, authorise } = require("../middleware/authMiddleware");

router.post("/", protect, bookSession);
router.get("/my", protect, getMySessions);
router.delete("/:id", protect, cancelSession);
router.get("/", protect, authorise("admin"), getAllSessions);

module.exports = router;
