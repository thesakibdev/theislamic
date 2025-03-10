const express = require("express");
const checkUserRole = require("../../middleware/authCheck.middleware");

const router = express.Router();

const {
  sendReport,
  getAllReports,
  updateReportStatus,
  deleteReport,
} = require("../../controllers/report/report.controller");

router.post("/post", sendReport);

router.get("/get", getAllReports);

router.put(
  "/update-status/:reportId",
  checkUserRole(["admin", "creator", "editor"]),
  updateReportStatus
);
router.delete(
  "/delete/:reportId",
  checkUserRole(["admin", "creator", "editor"]),
  deleteReport
);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const checkUserRole = require('../middleware/authCheck.middleware');
// const { getAllReports } = require('../controllers/report.controller');

// router.get('/reports', checkUserRole(['admin', 'creator', 'editor']), getAllReports);

// module.exports = router;
