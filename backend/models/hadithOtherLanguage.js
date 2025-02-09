const mongoose = require("mongoose");

const hadithSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  bookName: {
    type: String,
    required: true,
  },
  partNumber: {
    type: Number,
    required: true,
  },
  chapterNumber: {
    type: Number,
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
  },
  note: {
    type: String,
  },
});

module.exports = mongoose.model("Hadith-Other-Language", hadithSchema);
