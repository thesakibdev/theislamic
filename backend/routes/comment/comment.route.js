const express = require("express");
const {
  addComment,
  getApprovedComments,
  getAllComments,
  approveComment,
  rejectComment,
  getCommentStats,
  updateAllBlogStats,
} = require("../../controllers/comment/comment.controller");
const checkUserRole = require("../../middleware/authCheck.middleware");

const router = express.Router();

// Public routes (no authentication required)
router.post("/add", addComment);
router.get("/blog/:blogId", getApprovedComments);

// Admin routes (authentication required)
router.get(
  "/admin/all",
  checkUserRole(["admin", "creator", "editor"]),
  getAllComments
);
router.put(
  "/admin/approve/:id",
  checkUserRole(["admin", "creator", "editor"]),
  approveComment
);
router.delete(
  "/admin/reject/:id",
  checkUserRole(["admin", "creator", "editor"]),
  rejectComment
);
router.get(
  "/admin/stats",
  checkUserRole(["admin", "creator", "editor"]),
  getCommentStats
);
router.post(
  "/admin/update-all-stats",
  checkUserRole(["admin", "creator", "editor"]),
  updateAllBlogStats
);

module.exports = router;
