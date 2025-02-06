const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); // Adjust the path to your User model

const checkUserRole = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      // Get the token from cookies
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Access Denied: No Token Provided!",
        });
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user from the database if needed
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      // Check if the user's role matches the required roles
      if (!requiredRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access Denied: You do not have the required role",
        });
      }

      // Attach the user object to the request for further use
      req.user = user;
      next();
    } catch (error) {
      console.error("Error in checkUserRole middleware:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
};

module.exports = checkUserRole;
