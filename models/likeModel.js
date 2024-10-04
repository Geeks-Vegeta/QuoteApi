const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  quote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quote",
  },
  likeDate: {
    type: Date,
    default: Date.now,
  },
});

const likeModel = mongoose.model("Like", likeSchema);

module.exports = likeModel;
