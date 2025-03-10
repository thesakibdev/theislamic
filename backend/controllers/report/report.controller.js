const Report = require("../../models/report.model");

const mongoose = require("mongoose");

const sendReport = async (req, res) => {
  const { sender, errorType, additionalDetails, senderEmail } = req.body;

  console.log(sender, errorType, additionalDetails, senderEmail);

  try {
    if (!senderEmail?.trim()) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid sender email." });
    }
    if (!sender?.trim()) {
      return res.status(400).json({ error: true, message: "Invalid sender." });
    }
    if (!errorType?.trim()) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid error type." });
    }
    if (!additionalDetails?.trim()) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid additional details." });
    }

    // MongoDB ObjectId ভ্যালিড কিনা চেক করা
    if (!mongoose.Types.ObjectId.isValid(sender)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid sender ID format." });
    }

    // ObjectId তে কনভার্ট করা
    const senderObjectId = new mongoose.Types.ObjectId(sender);

    const newReport = new Report({
      sender: senderObjectId, // এখানে ObjectId দেওয়া হচ্ছে
      errorType: errorType.trim(),
      additionalDetails: additionalDetails.trim(),
      senderEmail: senderEmail.trim(),
    });

    await newReport.save();
    res
      .status(200)
      .json({ success: true, message: "Report sent successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({});
    res.status(200).json({ error: false, data: reports });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

const updateReportStatus = async (req, res) => {
  const { reportId } = req.params;
  const { status } = req.body;

  try {
    // Validate input
    if (!status) {
      return res
        .status(400)
        .json({ error: true, message: "Status is required" });
    }

    // Find and update the report status
    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ error: true, message: "Report not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Report status updated successfully",
      report,
    });
  } catch (error) {
    console.error("Error in updateReportStatus:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const deleteReport = async (req, res) => {
  const { reportId } = req.params;

  try {
    // Find and delete the report
    const report = await Report.findByIdAndDelete(reportId);

    if (!report) {
      return res.status(404).json({ error: true, message: "Report not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
      report,
    });
  } catch (error) {
    console.error("Error in deleteReport:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = {
  sendReport,
  getAllReports,
  updateReportStatus,
  deleteReport,
};
