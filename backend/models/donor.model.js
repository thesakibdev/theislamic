const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String },
  email: { type: String },
  phone: { type: String, required: true, unique: true },
  dateOfBirth: { type: String },
  profession: { type: String, default: "Not Provided" },
  designation: { type: String, default: "Not Provided" },
  companyName: { type: String, default: "Not Provided" },
  street: { type: String, default: "Not Provided" },
  city: { type: String, default: "Not Provided" },
  country: { type: String, required: true },
  TotalDonation: { type: Number, required: true, default: 0 },
  avatar: { type: String, default: "" },
  avatarId: { type: String, default: "" },
  isDetailsVisible: { type: Boolean, default: true },
  donateDate: { type: String },
  donationHistory: [
    {
      amount: { type: Number, required: true },
      donateDate: { type: String, required: true },
      typeOfDonation: { type: String },
    },
  ],
});

module.exports = mongoose.model("Donor", donorSchema);
