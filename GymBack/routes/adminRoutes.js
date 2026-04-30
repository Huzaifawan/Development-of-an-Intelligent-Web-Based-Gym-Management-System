const express = require("express");
const router = express.Router();
const { getDashboardStats, getAllMembersWithDetails, toggleUserActive } = require("../controllers/adminController");
const { protect, authorise } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, authorise("admin"), getDashboardStats);
router.get("/members", protect, authorise("admin"), getAllMembersWithDetails);

// ✅ NEW: Activate or deactivate a user account
router.put("/users/:id/toggle-active", protect, authorise("admin"), toggleUserActive);

module.exports = router;
