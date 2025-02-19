const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./lib/db");
const trackVisits = require("./middleware/visitor.middleware");

// import router here
const authRouter = require("./routes/auth/auth.route");
const surahRouter = require("./routes/surah/surah.route");
const visitorRouter = require("./routes/visit/visitor.route");
const blogRouter = require("./routes/blog/blog.route");
const hadithRouter = require("./routes/hadith/hadith.route");
const languageRouter = require("./routes/utils/language.route");
const bookListRouter = require("./routes/utils/bookList.route");
const donorRouter = require("./routes/donor/donor.route");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://theislamics.com",
  "https://www.theislamics.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// route list
// Robots.txt route
app.get("/", (req, res, next) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  next();
});

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nDisallow: /");
});

app.use(trackVisits);

// auth route
app.use("/api/v1/auth", authRouter);

// quran route
app.use("/api/v1/admin", surahRouter);

// blog route
app.use("/api/v1/admin/blog", blogRouter);

// hadith route
app.use("/api/v1/admin/hadith", hadithRouter);

// donor route
app.use("/api/v1/donor", donorRouter);

// visitor route
app.use("/api/v1/admin/analytics", visitorRouter);

// utilities route
app.use("/api/v1/utils", languageRouter);
app.use("/api/v1/utils", bookListRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  connectDB();
});
