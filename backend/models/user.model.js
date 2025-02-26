const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "" },
  phone: { type: String, default: "Not Provided" },
  companyName: { type: String, default: "Not Provided" },
  designation: { type: String, default: "Not Provided" },
  country: { type: String, default: "Not Provided" },
  address: { type: String, default: "Not Provided" },
  totalDonation: { type: Number, default: 0 },
  role: { type: String, default: "reader" },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
});

module.exports = mongoose.model("User", userSchema);
