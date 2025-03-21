const express = require("express");
const { upload } = require("../../lib/cloudinary");

const {
  handleImageUpload,
  createDonor,
  getAllDonors,
  editDonor,
  deleteDonor,
  editDonationHistory,
  addNewDonationHistory,
  deleteDonorHistory,
} = require("../../controllers/donor/donor.controller");
const checkUserRole = require("../../middleware/authCheck.middleware");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/create", createDonor);
router.post("/add-history/:id", addNewDonationHistory);
router.put("/edit/:id", editDonor);
router.put("/edit/history/:donorId/:historyId", editDonationHistory);
router.delete("/delete/:id", deleteDonor);
router.delete("/delete/history/:donorId/:historyId", deleteDonorHistory);
router.get("/get", getAllDonors);

module.exports = router;
