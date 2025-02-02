const mongoose = require("mongoose");

const quoteSchema = mongoose.Schema({
  quote: {
    type: String,
    required: true,
  },
  like: {
    type: Number,
  },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      content: { type: String, required: true },
      createdAt: Number,
    },
  ],

  likes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      createdAt: Number,
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
