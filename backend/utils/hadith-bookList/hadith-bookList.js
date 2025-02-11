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
  { nameEn: "Sahih Muslim", nameBn: "঴঵ী঵ মু঴চ঱ম", code: "(d. 261 AH) C" },
  {
    nameEn: "Sunan Ibn Mājah",
    nameBn: "঴ুনাব্দন ইবব্দন মাজা঵",
    code: "(d. 273 AH) C",
  },
  { nameEn: "Sunan Abi Dawud", nameBn: "঴঴ুনান আবূ দাউদ", code: "(d. 275 AH)" },
  {
    nameEn: "Sunan At-Tirmidhi",
    nameBn: "঴ুনান আত চতরচমচয",
    code: "(d. 279 AH) C",
  },
  {
    nameEn: "Sunan Al-Nasa'I",
    nameBn: "঴ুনান আন না঴াঈ",
    code: "(d. 303 AH) C",
  },
  {
    nameEn: "Muwatta Imam Malik",
    nameBn: "মুয়ািা ইমাম মাব্দ঱ক",
    code: "(d. 179 AH)",
  },
  { nameEn: "Musnad Ahmad", nameBn: "মু঴নাব্দদ আ঵মাদ", code: "(d. 241 AH)" },
  {
    nameEn: "Sunan Ad-Darimi",
    nameBn: "঴ুনান আদ্দাব্দরমী",
    code: "(d. 255 AH)",
  },
  {
    nameEn: "Al-Adab Al-Mufrad",
    nameBn: "আ঱-আদাবু঱ মুফরাদ",
    code: "(d. 256 AH)",
  },
  { nameEn: "An-Nawawi’s Forty", nameBn: "আন নওয়াবীর িচিল", code: "" },
  {
    nameEn: "Mishkat Al-Masabih",
    nameBn: "চমলকাতু ঱ মা঴াচব঵",
    code: "(d. 1248)",
  },
  {
    nameEn: "Riyad As-Salihin",
    nameBn: "চরয়াদু঴ ঴াব্দ঱঵ীন",
    code: "(1233–1277)",
  },
  {
    nameEn: "Bulūgh Al-Marām",
    nameBn: "বু঱ুগ আ঱ মারাম",
    code: "(1372 – 1448)",
  },
  { nameEn: "Hisn Al-Muslim", nameBn: "চ঵঴নু঱ মু঴চ঱ম", code: "" },
  {
    nameEn: "Ash-Shama'il Al-Muhammadiyah",
    nameBn: "আল-লামাই঱ আ঱-মু঵াম্মাচদয",
    code: "",
  },
  { nameEn: "Thematic", nameBn: "চব঳য়চভচিক", code: "" },
];

// MongoDB connection string
const mongoURI =
  "mongodb+srv://thesakibdev:thesakibdev@working.quc5u.mongodb.net/theislamic_db?retryWrites=true&w=majority&appName=working"; // Replace with your actual database name

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
// const insertLanguages = async () => {
//   try {
//     for (const book of Books) {
//       await BookList.updateOne(
//         { nameEn: book.nameEn }, // Check if book already exists by name
//         { $setOnInsert: book }, // Insert only if it doesn't exist
//         { upsert: true } // Prevent duplicate inserts
//       );
//     }
//     console.log("BookList inserted/updated successfully!");
//   } catch (error) {
//     console.error("Error inserting books:", error);
//   } finally {
//     mongoose.connection.close();
//   }
// };

module.exports = BookList;
