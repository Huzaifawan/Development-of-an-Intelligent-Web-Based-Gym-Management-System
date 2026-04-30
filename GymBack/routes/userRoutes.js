const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");
const { protect, authorise } = require("../middleware/authMiddleware");

router.get("/", protect, authorise("admin"), getAllUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, authorise("admin"), deleteUser);

module.exports = router;
