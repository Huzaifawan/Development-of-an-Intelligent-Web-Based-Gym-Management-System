const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Trainer = require("../models/Trainer");
const Membership = require("../models/Membership");

router.get("/", async (req, res) => {
  try {
    const [totalMembers, totalTrainers, activeMembers] = await Promise.all([
      User.countDocuments({ role: "member" }),
      Trainer.countDocuments({ isAvailable: true }),
      Membership.countDocuments({ status: "active" }),
    ]);

    res.json({
      success: true,
      stats: {
        totalMembers,
        totalTrainers,
        activeMembers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch stats" });
  }
});

module.exports = router;
