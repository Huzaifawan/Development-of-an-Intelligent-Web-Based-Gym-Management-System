const express = require("express");
const router = express.Router();
const {
  createMembership,
  getMyMembership,
  getAllMemberships,
  updateMembership,
  cancelMembership,
} = require("../controllers/membershipController");
const { protect, authorise } = require("../middleware/authMiddleware");

router.post("/", protect, createMembership);
router.get("/my", protect, getMyMembership);
router.get("/", protect, authorise("admin"), getAllMemberships);
router.put("/:id", protect, authorise("admin"), updateMembership);
router.delete("/:id", protect, cancelMembership);

module.exports = router;
