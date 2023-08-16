const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A Blog must have a title"],
    unique: true,
  },

  Header: String,

  content: {
    type: String,
    required: [true, "A Blog must have a content"],
  },

  author: {
    type: String,
    required: [true, "A Blog must have a author"],
  },
  date: { type: Date, default: Date() },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
