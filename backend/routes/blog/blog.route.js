const express = require("express");
const { upload } = require("../../lib/cloudinary");
const {
  addBlog,
  deleteBlog,
  fetchAllBlog,
  editBlog,
  handleImageUpload,
} = require("../../controllers/blog/blog.controller");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addBlog);
router.put("/edit/:id", editBlog);
router.delete("/delete/:id", deleteBlog);
router.get("/get", fetchAllBlog);

module.exports = router;
