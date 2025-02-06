const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  phone: { type: String },
  companyName: { type: String, default: "Not Provided" },
  designation: { type: String, default: "Not Provided" },
  country: { type: String },
  address: { type: String },
  totalDonation: { type: Number, default: 0 },
  role: { type: String, required: true, default: "reader" },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
});

module.exports = mongoose.model("User", userSchema);
