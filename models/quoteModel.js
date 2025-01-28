const mongoose = require("mongoose");

const quoteSchema = mongoose.Schema({
  quote: {
    type: String,
    required: true,
  },
  like: {
    type: Number,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  tags: {
    type: Array,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: Number,
  updatedAt: Number,
});

const quoteModel = mongoose.model("Quote", quoteSchema);

module.exports = quoteModel;
