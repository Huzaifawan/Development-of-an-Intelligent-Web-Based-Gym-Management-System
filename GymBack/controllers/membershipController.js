const Membership = require("../models/Membership");

const PLAN_PRICES = {
  basic: 2000,
  standard: 4000,
  premium: 7000,
};

const PLAN_FEATURES = {
  basic: ["Gym access (6am–10pm)", "Locker room", "Basic equipment"],
  standard: ["All Basic features", "Group classes", "Sauna access"],
  premium: ["All Standard features", "Personal trainer", "Diet consultation", "24/7 access"],
};

// @desc    Create membership
// @route   POST /api/memberships
// @access  Private
const createMembership = async (req, res, next) => {
  try {
    const { planType, durationMonths = 1 } = req.body;

    // ✅ Validate planType
    if (!PLAN_PRICES[planType]) {
      return res.status(400).json({ success: false, message: "Invalid plan type. Choose basic, standard or premium" });
    }

    // ✅ Validate durationMonths
    const duration = parseInt(durationMonths);
    if (isNaN(duration) || duration < 1 || duration > 12) {
      return res.status(400).json({ success: false, message: "durationMonths must be a number between 1 and 12" });
    }

    // ✅ Check for existing active membership
    const existingMembership = await Membership.findOne({ user: req.user._id, status: "active" });
    if (existingMembership) {
      return res.status(400).json({ success: false, message: "You already have an active membership" });
    }

    const startDate = new Date();

    // ✅ FIXED: Safe month calculation — avoids JS setMonth() edge case on month-end dates
    // e.g. Jan 31 + 1 month would wrongly become Mar 3 with setMonth()
    const endDate = new Date(startDate);
    endDate.setDate(1); // go to 1st of current month
    endDate.setMonth(endDate.getMonth() + duration); // add months safely
    // Set to last day of target month
    const lastDay = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
    endDate.setDate(Math.min(startDate.getDate(), lastDay));

    const membership = await Membership.create({
      user: req.user._id,
      planType,
      price: PLAN_PRICES[planType] * duration,
      startDate,
      endDate,
      features: PLAN_FEATURES[planType],
    });

    res.status(201).json({ success: true, membership });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my membership
// @route   GET /api/memberships/my
// @access  Private
const getMyMembership = async (req, res, next) => {
  try {
    // ✅ FIXED: findOne() does not support .sort() — use find().sort().limit(1)
    const membership = await Membership.find({ user: req.user._id, status: "active" })
      .sort({ createdAt: -1 })
      .limit(1)
      .then((results) => results[0]);

    if (!membership)
      return res.status(404).json({ success: false, message: "No active membership found" });

    res.json({ success: true, membership });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all memberships (Admin)
// @route   GET /api/memberships
// @access  Admin
const getAllMemberships = async (req, res, next) => {
  try {
    const memberships = await Membership.find().populate("user", "name email phone");
    res.json({ success: true, count: memberships.length, memberships });
  } catch (error) {
    next(error);
  }
};

// @desc    Update membership status
// @route   PUT /api/memberships/:id
// @access  Admin
const updateMembership = async (req, res, next) => {
  try {
    const { status, paymentStatus, planType, endDate } = req.body;

    // ✅ FIXED: Only allowed fields — prevents mass assignment
    const updateData = { status, paymentStatus, endDate };

    // ✅ FIXED: If planType changes, recalculate price and features automatically
    if (planType && PLAN_PRICES[planType]) {
      updateData.planType = planType;
      updateData.price = PLAN_PRICES[planType];
      updateData.features = PLAN_FEATURES[planType];
    }

    const membership = await Membership.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!membership)
      return res.status(404).json({ success: false, message: "Membership not found" });

    res.json({ success: true, membership });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel membership
// @route   DELETE /api/memberships/:id
// @access  Private / Admin
const cancelMembership = async (req, res, next) => {
  try {
    // ✅ FIXED: Find first, then check ownership, then update
    const membership = await Membership.findById(req.params.id);

    if (!membership) {
      return res.status(404).json({ success: false, message: "Membership not found" });
    }

    // ✅ Only owner or admin can cancel
    if (membership.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorised to cancel this membership" });
    }

    if (membership.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Membership is already cancelled" });
    }

    membership.status = "cancelled";
    await membership.save();

    res.json({ success: true, message: "Membership cancelled", membership });
  } catch (error) {
    next(error);
  }
};

module.exports = { createMembership, getMyMembership, getAllMemberships, updateMembership, cancelMembership };
