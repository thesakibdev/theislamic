const Report = require("../../models/report.model");

const sendReport = async (res, req) => {
  const { sender, errorType, additionalDetails, senderEmail } = req.body;
  try {
    const normalizedSender = sender.trim();
    const normalizedErrorType = errorType.trim();
    const normalizedAdditionalDetails = additionalDetails.trim();
    const normalizedSenderEmail = senderEmail.trim();

    if (!normalizedSenderEmail) {
      return res.status(400).json({
        error: true,
        message: "Invalid sender email.",
      });
    }

    if (!normalizedSender) {
      return res.status(400).json({
        error: true,
        message: "Invalid sender.",
      });
    }

    if (!normalizedErrorType) {
      return res.status(400).json({
        error: true,
        message: "Invalid error type.",
      });
    }

    if (!normalizedAdditionalDetails) {
      return res.status(400).json({
        error: true,
        message: "Invalid additional details.",
      });
    }

    const newReport = new Report({
      sender: normalizedSender,
      errorType: normalizedErrorType,
      additionalDetails: normalizedAdditionalDetails,
    });

    await newReport.save();
    res
      .status(200)
      .json({ error: false, message: "Report sent successfully." });
  } catch (error) {
    console.error("Error:", err);
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
