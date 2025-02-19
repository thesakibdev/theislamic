const express = require("express");

const {
  handleImageUpload,
  createDonor,
  getAllDonors,
  editDonor,  
} = require("../../controllers/donor/donor.controller");
const checkUserRole = require("../../middleware/authCheck.middleware");

const router = express.Router();

router.post(
  "/upload-image",
  checkUserRole(["admin", "creator"]),
  handleImageUpload
);
router.post("/create", checkUserRole(["admin", "creator"]), createDonor);
router.get("/get", getAllDonors);
router.put("/edit/:id", checkUserRole(["admin", "creator"]), editDonor);

module.exports = router;
