const User = require("../models/User");
const Membership = require("../models/Membership");
const Trainer = require("../models/Trainer");

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
const getDashboardStats = async (req, res, next) => {
  try {
    // ✅ Run all queries in parallel for performance
    const [totalUsers, activeMembers, totalTrainers, expiredMemberships, recentUsers, recentMemberships, revenue] =
      await Promise.all([
        User.countDocuments({ role: "member" }),
        Membership.countDocuments({ status: "active" }),
        Trainer.countDocuments(),
        Membership.countDocuments({ status: "expired" }),
        User.find({ role: "member" }).sort({ createdAt: -1 }).limit(5).select("name email createdAt"),
        Membership.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email"),
        Membership.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$price" } } },
        ]),
      ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeMembers,
        totalTrainers,
        expiredMemberships,
        totalRevenue: revenue[0]?.total || 0,
      },
      recentUsers,
      recentMemberships,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all members with membership info
// @route   GET /api/admin/members
// @access  Admin
const getAllMembersWithDetails = async (req, res, next) => {
  try {
    // ✅ Single aggregation pipeline — avoids N+1 queries
    const result = await User.aggregate([
      { $match: { role: "member" } },
      {
        $lookup: {
          from: "memberships",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", "$$userId"] },
                    { $eq: ["$status", "active"] },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
          ],
          as: "memberships",
        },
      },
      { $addFields: { membership: { $arrayElemAt: ["$memberships", 0] } } },
      { $project: { password: 0, memberships: 0 } },
    ]);

    res.json({ success: true, count: result.length, members: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active/inactive status
// @route   PUT /api/admin/users/:id/toggle-active
// @access  Admin
const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Prevent admin from deactivating themselves
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: "Admin cannot deactivate their own account" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User account ${user.isActive ? "activated" : "deactivated"} successfully`,
      user: { _id: user._id, name: user.name, email: user.email, isActive: user.isActive },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getAllMembersWithDetails, toggleUserActive };
