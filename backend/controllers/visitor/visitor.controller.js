const Visit = require("../../models/counter.model");

const getVisitorCount = async (req, res) => {
  try {
    const visitorCount = await Visit.countDocuments(); // Use the countDocuments method
    res.status(200).json({
      success: true,
      data: visitorCount,
    });
  } catch (error) {
    console.error(error); // Print the error for debugging
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching the visitor count.",
    });
  }
};

module.exports = { getVisitorCount };
