const mongoose = require("mongoose");

// language model
const languageSchema = new mongoose.Schema({
  name: String,
  code: String,
});

const Language = mongoose.model("Language", languageSchema);

// initial total 22 languages
const languages = [
  { name: "English", code: "en" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
  { name: "German", code: "de" },
  { name: "Mandarin Chinese", code: "zh" },
  { name: "Hindi", code: "hi" },
  { name: "Arabic", code: "ar" },
  { name: "Bengali", code: "bn" },
  { name: "Russian", code: "ru" },
  { name: "Portuguese", code: "pt" },
  { name: "Japanese", code: "ja" },
  { name: "Italian", code: "it" },
  { name: "Korean", code: "ko" },
  { name: "Turkish", code: "tr" },
  { name: "Dutch", code: "nl" },
  { name: "Vietnamese", code: "vi" },
  { name: "Tamil", code: "ta" },
  { name: "Urdu", code: "ur" },
  { name: "Polish", code: "pl" },
  { name: "Thai", code: "th" },
  { name: "Indonesian", code: "id" },
  { name: "Filipino", code: "tl" },
];

// MongoDB connection string
const mongoURI =
  "mongodb+srv://mahbub:mahbub@theislamicdb.2g6v7.mongodb.net/theislamicdb?retryWrites=true&w=majority&appName=theislamicdb";  // Replace with your actual database name

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
// const insertLanguages = async () => {
//   try {
//     for (const lang of languages) {
//       await Language.updateOne(
//         { code: lang.code }, // Check if language with this code exists
//         { $setOnInsert: lang }, // Insert only if it doesn't exist
//         { upsert: true } // Prevent duplicate inserts
//       );
//     }
//     console.log("Languages inserted/updated successfully!");
//   } catch (error) {
//     console.error("Error inserting languages:", error);
//   } finally {
//     mongoose.connection.close();
//   }
// };

module.exports = Language;
