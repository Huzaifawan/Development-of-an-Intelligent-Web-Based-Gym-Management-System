const Trainer = require("../models/Trainer");

// @desc    Get all trainers
// @route   GET /api/trainers
// @access  Public
const getAllTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find({ isAvailable: true });
    res.json({ success: true, count: trainers.length, trainers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trainer by ID
// @route   GET /api/trainers/:id
// @access  Public
const getTrainerById = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer)
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    res.json({ success: true, trainer });
  } catch (error) {
    next(error);
  }
};

// @desc    Create trainer
// @route   POST /api/trainers
// @access  Admin
const createTrainer = async (req, res, next) => {
  try {
    // ✅ FIXED: Replaced req.body with explicit allowed fields only
    const {
      user,
      name,
      specialisation,
      bio,
      experience,
      contact,
      profileImage,
      schedule,
      isAvailable,
      rating,
    } = req.body;

    // Required field validation
    if (!name || !specialisation) {
      return res.status(400).json({
        success: false,
        message: "Name and specialisation are required",
      });
    }

    const trainer = await Trainer.create({
      user,
      name,
      specialisation,
      bio,
      experience,
      contact,
      profileImage,
      schedule,
      isAvailable,
      rating,
    });
    res.status(201).json({ success: true, trainer });
  } catch (error) {
    next(error);
  }
};

// @desc    Update trainer
// @route   PUT /api/trainers/:id
// @access  Admin
const updateTrainer = async (req, res, next) => {
  try {
    // ✅ FIXED: Replaced raw req.body with explicit allowed fields only
    const {
      name,
      specialisation,
      bio,
      experience,
      contact,
      profileImage,
      schedule,
      isAvailable,
      rating,
    } = req.body;

    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      {
        name,
        specialisation,
        bio,
        experience,
        contact,
        profileImage,
        schedule,
        isAvailable,
        rating,
      },
      { new: true, runValidators: true },
    );
    if (!trainer)
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    res.json({ success: true, trainer });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete trainer
// @route   DELETE /api/trainers/:id
// @access  Admin
const deleteTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer)
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    res.json({ success: true, message: "Trainer deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trainer schedule by ID
// @route   GET /api/trainers/:id/schedule
// @access  Public
const getTrainerSchedule = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id).select(
      "name schedule",
    );
    if (!trainer)
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    res.json({ success: true, schedule: trainer.schedule });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTrainers,
  getTrainerById,
  getTrainerSchedule,
  createTrainer,
  updateTrainer,
  deleteTrainer,
};
