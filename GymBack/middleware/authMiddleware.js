const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - verify JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      // ✅ Check if account is still active
      if (!req.user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Your account has been deactivated. Contact admin.",
        });
      }

      next();
    } catch (error) {
      // ✅ Pass JWT errors to error handler for consistent error format
      return next(error);
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Not authorised, no token" });
  }
};

// Role-based access control
const authorise = (...roles) => {
  return (req, res, next) => {
    // ✅ Guard against authorise being called without protect middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorised, please login",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not allowed to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorise };
