const mongoose = require("mongoose");

// language model
const bookListSchema = new mongoose.Schema({
  nameEn: String,
  nameBn: String,
  code: String,
  id: String,
});

const BookList = mongoose.model("Hadith-Book-List", bookListSchema);

const Books = [
  {
    nameEn: "Sahih Al-Bukhari",
    nameBn: "সহীহ আল-বুখারী",
    code: "(d. 256 AH) C",
    id: "bukhari",
  },
  {
    nameEn: "Sahih Muslim",
    nameBn: "সহীহ মুসলিম",
    code: "(d. 261 AH) C",
    id: "muslim",
  },
  {
    nameEn: "Sunan Ibn Mājah",
    nameBn: "সুনান ইবনে মাজাহ",
    code: "(d. 273 AH) C",
    id: "ibnmajah",
  },
  {
    nameEn: "Sunan Abi Dawud",
    nameBn: "সুনান আবু দাউদ",
    code: "(d. 275 AH)",
    id: "abudawud",
  },
  {
    nameEn: "Sunan At-Tirmidhi",
    nameBn: "সুনান আত তিরমিযি",
    code: "(d. 279 AH) C",
    id: "tirmidhi",
  },
  {
    nameEn: "Sunan Al-Nasa'I",
    nameBn: "সুনান আন নাসাঈ",
    code: "(d. 303 AH) C",
    id: "nasai",
  },
  {
    nameEn: "Muwatta Imam Malik",
    nameBn: "মুআত্তা ইমাম মালেক",
    code: "(d. 179 AH)",
    id: "imammalik",
  },
  {
    nameEn: "Musnad Ahmad",
    nameBn: "মুসনাদ আহমাদ",
    code: "(d. 241 AH)",
    id: "musnadahmad",
  },
  {
    nameEn: "Sunan Ad-Darimi",
    nameBn: "সুনান আদ দারেমী",
    code: "(d. 255 AH)",
    id: "adDarimi",
  },
  {
    nameEn: "Al-Adab Al-Mufrad",
    nameBn: "আল-আদাবুল মুফরাদ",
    code: "(d. 256 AH)",
    id: "adabalmufrad",
  },
  {
    nameEn: "An-Nawawi’s Forty",
    nameBn: "আন নওয়াবীর চল্লিশ",
    code: "",
    id: "nawawi",
  },
  {
    nameEn: "Mishkat Al-Masabih",
    nameBn: "মিশকাতুল মাসাবিহ",
    code: "(d. 1248)",
    id: "mishkat",
  },
  {
    nameEn: "Riyad As-Salihin",
    nameBn: "রিয়াদুস সালেহীন",
    code: "(1233–1277)",
    id: "riyadussalihin",
  },
  {
    nameEn: "Bulūgh Al-Marām",
    nameBn: "বুলূগ আল মারাম",
    code: "(1372 – 1448)",
    id: "bulughalmaram",
  },
  {
    nameEn: "Hisn Al-Muslim",
    nameBn: "হিসনুল মুসলিম",
    code: "",
    id: "hisnalmuslim",
  },
  {
    nameEn: "Ash-Shama'il Al-Muhammadiyah",
    nameBn: "আশ-শামাইল আল-মুহাম্মাদিয়া",
    code: "",
    id: "muhammadiyah",
  },
  { nameEn: "Thematic", nameBn: "বিষয়ভিত্তিক", code: "", id: "thematic" },
];

// MongoDB connection string
// const mongoURI =
//   "mongodb+srv://mahbub:mahbub@theislamicdb.2g6v7.mongodb.net/theislamicdb?retryWrites=true&w=majority&appName=theislamicdb";

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

// insert languages into database
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
