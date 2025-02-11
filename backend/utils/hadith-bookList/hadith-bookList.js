const mongoose = require("mongoose");

// language model
const bookListSchema = new mongoose.Schema({
  nameEn: String,
  nameBn: String,
  code: String,
});

const BookList = mongoose.model("Hadith-Book-List", bookListSchema);
// initial total 22 languages
const Books = [
  {
    nameEn: "Sahih Al-Bukhari",
    nameBn: "সহীহ আল-বুখারী",
    code: "(d. 256 AH) C",
  },
  { nameEn: "Sahih Muslim", nameBn: "সহীহ মুসলিম", code: "(d. 261 AH) C" },
  {
    nameEn: "Sunan Ibn Mājah",
    nameBn: "সুনান ইবনে মাজাহ",
    code: "(d. 273 AH) C",
  },
  { nameEn: "Sunan Abi Dawud", nameBn: "সুনান আবু দাউদ", code: "(d. 275 AH)" },
  {
    nameEn: "Sunan At-Tirmidhi",
    nameBn: "সুনান আত তিরমিযি",
    code: "(d. 279 AH) C",
  },
  {
    nameEn: "Sunan Al-Nasa'I",
    nameBn: "সুনান আন নাসাঈ",
    code: "(d. 303 AH) C",
  },
  {
    nameEn: "Muwatta Imam Malik",
    nameBn: "মুআত্তা ইমাম মালেক",
    code: "(d. 179 AH)",
  },
  { nameEn: "Musnad Ahmad", nameBn: "মুসনাদ আহমাদ", code: "(d. 241 AH)" },
  {
    nameEn: "Sunan Ad-Darimi",
    nameBn: "সুনান আদ দারেমী",
    code: "(d. 255 AH)",
  },
  {
    nameEn: "Al-Adab Al-Mufrad",
    nameBn: "আল-আদাবুল মুফরাদ",
    code: "(d. 256 AH)",
  },
  { nameEn: "An-Nawawi’s Forty", nameBn: "আন নওয়াবীর চল্লিশ", code: "" },
  {
    nameEn: "Mishkat Al-Masabih",
    nameBn: "মিশকাতুল মাসাবিহ",
    code: "(d. 1248)",
  },
  {
    nameEn: "Riyad As-Salihin",
    nameBn: "রিয়াদুস সালেহীন",
    code: "(1233–1277)",
  },
  {
    nameEn: "Bulūgh Al-Marām",
    nameBn: "বুলূগ আল মারাম",
    code: "(1372 – 1448)",
  },
  { nameEn: "Hisn Al-Muslim", nameBn: "হিসনুল মুসলিম", code: "" },
  {
    nameEn: "Ash-Shama'il Al-Muhammadiyah",
    nameBn: "আশ-শামাইল আল-মুহাম্মাদিয়া",
    code: "",
  },
  { nameEn: "Thematic", nameBn: "বিষয়ভিত্তিক", code: "" },
];


// Connect to MongoDB
// mongoose
//   .connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("MongoDB connected successfully!");
//     // Insert languages into database
//     insertLanguages();
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });

// // insert languages into database
const insertLanguages = async () => {
  try {
    for (const book of Books) {
      await BookList.updateOne(
        { nameEn: book.nameEn }, // Check if book already exists by name
        { $setOnInsert: book }, // Insert only if it doesn't exist
        { upsert: true } // Prevent duplicate inserts
      );
    }
    console.log("BookList inserted/updated successfully!");
  } catch (error) {
    console.error("Error inserting books:", error);
  } finally {
    mongoose.connection.close();
  }
};

module.exports = BookList;
