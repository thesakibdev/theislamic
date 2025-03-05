const mongoose = require("mongoose");

// language model
const languageSchema = new mongoose.Schema({
  name: String,
  code: String,
});

const Language = mongoose.model("Language", languageSchema);

// initial total 22 languages
const languages = [
  { name: "Bengali", code: "bn" },
  { name: "English", code: "en" },
  { name: "Hindi", code: "hi" },
  { name: "Portuguese", code: "pt" },
  { name: "German", code: "de" },
  { name: "French", code: "fr" },
  { name: "Spanish", code: "es" },
  { name: "Turkish", code: "tr" },
  { name: "Italian", code: "it" },
  { name: "Dutch", code: "nl" },
  { name: "Russian", code: "ru" },
  { name: "Filipino", code: "tl" },
  { name: "Thai", code: "th" },
  { name: "Indonesian", code: "id" },
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
