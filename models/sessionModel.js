const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  action: {
    type: String,
  },
  token: {
    type: String,
  },
  valid: {
    type: Boolean,
  },
  useragent: {
    type: Object,
  },
  createdAt: Number,
});
const sessionModel = mongoose.model("sessions", sessionSchema);

module.exports = sessionModel;
