const Session = require("../models/Session");
const Trainer = require("../models/Trainer");

// @desc    Book a session with a trainer
// @route   POST /api/sessions
// @access  Private (logged-in member)
const bookSession = async (req, res, next) => {
  try {
    const { trainerId, date, startTime, endTime, sessionType, notes } = req.body;

    if (!trainerId || !date || !startTime || !endTime || !sessionType) {
      return res.status(400).json({
        success: false,
        message: "trainerId, date, startTime, endTime and sessionType are required",
      });
    }

    // Verify trainer exists and is available
    const trainer = await Trainer.findById(trainerId);
    if (!trainer || !trainer.isAvailable) {
      return res.status(404).json({ success: false, message: "Trainer not found or unavailable" });
    }

    // Check for duplicate booking
    const conflict = await Session.findOne({
      trainer: trainerId,
      date: new Date(date),
      startTime,
      status: { $ne: "cancelled" },
    });
    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked. Please choose another time.",
      });
    }

    const session = await Session.create({
      user: req.user._id,
      trainer: trainerId,
      date: new Date(date),
      startTime,
      endTime,
      sessionType,
      notes,
    });

    await session.populate("trainer", "name specialisation contact");

    res.status(201).json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my booked sessions
// @route   GET /api/sessions/my
// @access  Private
const getMySessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .populate("trainer", "name specialisation profileImage")
      .sort({ date: -1 });

    res.json({ success: true, count: sessions.length, sessions });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a session
// @route   DELETE /api/sessions/:id
// @access  Private
const cancelSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorised to cancel this session" });
    }

    if (session.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Session already cancelled" });
    }

    session.status = "cancelled";
    await session.save();

    res.json({ success: true, message: "Session cancelled", session });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sessions (Admin)
// @route   GET /api/sessions
// @access  Admin
const getAllSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find()
      .populate("user", "name email")
      .populate("trainer", "name specialisation")
      .sort({ date: -1 });

    res.json({ success: true, count: sessions.length, sessions });
  } catch (error) {
    next(error);
  }
};

module.exports = { bookSession, getMySessions, cancelSession, getAllSessions };
