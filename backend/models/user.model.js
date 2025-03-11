const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  email: { type: String, unique: true, default: "Not Provided" },
  avatar: { type: String, default: "" },
  profession: { type: String, default: "Not Provided" },
  companyName: { type: String, default: "Not Provided" },
  designation: { type: String, default: "Not Provided" },
  address: [
    {
      street: { type: String, default: "Not Provided" },
      city: { type: String, default: "Not Provided" },
      country: { type: String, default: "Not Provided" },
    },
  ],
  totalDonation: { type: Number, default: 0 },
  role: {
    type: String,
    enum: ["creator", "editor", "admin", "reader"],
    default: "reader",
  },
});

module.exports = mongoose.model("User", userSchema);
