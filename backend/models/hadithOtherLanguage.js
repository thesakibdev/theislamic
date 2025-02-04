const mongoose = require("mongoose");

const hadithSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  hadithNumber: {
    type: Number,
    required: true,
  },
  hadithText: {
    type: String,
    required: true,
  },
  referenceBook: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Hadith-Other-Language", hadithSchema);
