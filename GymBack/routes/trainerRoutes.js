const express = require("express");
const router = express.Router();
const {
  getAllTrainers,
  getTrainerById,
  getTrainerSchedule,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} = require("../controllers/trainerController");
const { protect, authorise } = require("../middleware/authMiddleware");

router.get("/", getAllTrainers);
router.get("/:id", getTrainerById);
router.get("/:id/schedule", getTrainerSchedule); // ✅ Added: was missing
router.post("/", protect, authorise("admin"), createTrainer);
router.put("/:id", protect, authorise("admin"), updateTrainer);
router.delete("/:id", protect, authorise("admin"), deleteTrainer);

module.exports = router;
