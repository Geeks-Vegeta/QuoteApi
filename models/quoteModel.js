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
  postDate: {
    type: Date,
    default: Date.now,
  },
  postDateUpdate: {
    type: Date,
    default: Date.now,
  },
});

const quoteModel = mongoose.model("Quote", quoteSchema);

module.exports = quoteModel;
