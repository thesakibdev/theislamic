const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: Object,
    },
    thumbnail: {
      type: String,
    },
    shortDesc: {
      type: String,
    },
    metaTitle: {
      type: String,
    },
    metaDesc: {
      type: String,
    },
    metaKeyword: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
