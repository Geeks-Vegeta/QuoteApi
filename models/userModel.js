const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  profile_pic: {
    type: String,
    default:
      "https://res.cloudinary.com/getcomix/image/upload/v1686155630/quoteser/kxnmoyb8ns76izhvelph.jpg",
  },
  education: {
    type: String,
  },
  bio: {
    type: String,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  instagram_link: {
    type: String,
  },
  twitter_link: {
    type: String,
  },
  linkedIn_link: {
    type: String,
  },
  github_link: {
    type: String,
  },
  facebook_link: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Trans"],
    default: "Male",
  },
  background_image: {
    type: String,
    default:
      "https://res.cloudinary.com/getcomix/image/upload/v1686155883/quoteser-background/yb7oz0mbt4oaeycczrsz.jpg",
  },
  mobile_number: {
    type: String,
  },
  followers: {
    type: Array,
  },
  following: {
    type: Array,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  warning_number: {
    type: Number,
    default: 0,
  },
  user_location: {
    type: String,
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
