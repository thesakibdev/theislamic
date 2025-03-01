const mongoose = require("mongoose");

const TafsirSchema = new mongoose.Schema({
  surahNumber: { type: Number, required: true, ref: "Surah" },
  verseNumber: { type: Number, required: true, ref: "Surah" },
  totalVerseNumber: { type: Number, required: true, ref: "Surah" },
  tafsir: { type: String, required: true },
});

const Tafsir = mongoose.model("Tafsir", TafsirSchema);

module.exports = Tafsir;
