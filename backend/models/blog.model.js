const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    thumbnailId: {
      type: String,
    },
    shortDesc: {
      type: String,
    },
    slug: {
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
