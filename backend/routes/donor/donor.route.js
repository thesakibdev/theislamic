const express = require("express");
const { upload } = require("../../lib/cloudinary");

const {
  handleImageUpload,
  createDonor,
  getAllDonors,
  editDonor,
} = require("../../controllers/donor/donor.controller");
const checkUserRole = require("../../middleware/authCheck.middleware");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/create", createDonor);
router.get("/get", getAllDonors);
router.put("/edit/:id", editDonor);

module.exports = router;
