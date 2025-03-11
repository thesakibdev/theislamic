const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  updateUserRole,
  updateUserProfile,
  getUserDetails,
} = require("../../controllers/auth/auth.controller");
const checkUserRole = require("../../middleware/authCheck.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/update-profile", authMiddleware, updateUserProfile);
router.get("/get/user-details/:id", authMiddleware, getUserDetails);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res
    .status(200)
    .json({ success: true, user, message: "User authenticated successfully!" });
});

router.put(
  "/update-role/:userId",
  checkUserRole(["admin", "creator"]),
  updateUserRole
);

module.exports = router;
