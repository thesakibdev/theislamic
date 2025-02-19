const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  companyName: { type: String, default: "Not Provided" },
  designation: { type: String, default: "Not Provided" },
  country: { type: String, required: true },
  address: { type: String, required: true },
  TotalDonation: { type: Number, required: true },
  avatar: { type: String, default: "" },
  isDetailsVisible: { type: Boolean, default: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donor", donorSchema);
