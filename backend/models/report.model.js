const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  errorType: {
    type: String,
    require: true,
  },
  additionalDetails: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
  },
  status: {
    type: String,
    default: "unread",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", reportSchema);
