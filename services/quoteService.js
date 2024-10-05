const quoteModel = require("../models/quoteModel");

/**
 *
 * @param {*} quote
 * @returns
 */
const checkQuoteExists = async (quote) => {
  let quo = await quoteModel.findOne({ quote: quote });
  return quo;
};

/**
 *
 * @param {*} post
 * @returns
 */
const createQuote = async (post) => {
  const new_post = quoteModel(post);
  await new_post.save();
  return new_post;
};

/**
 *
 * @param {*} quoteId
 * @returns
 */
const checkQuote = async (quoteId) => {
  let check = quoteModel.findOne({ _id: quoteId });
  return check;
};

/**
 *
 * @param {*} quoteId
 * @returns
 */
const deleteQuote = async (quoteId) => {
  let quote = await quoteModel.deleteOne({ _id: quoteId });
  return quote;
};

/**
 *
 * @param {*} quoteId
 * @param {*} quote
 * @returns
 */
const updateQuote = async (quoteId, quote) => {
  const update_post = await quoteModel.findByIdAndUpdate(
    { _id: quoteId },
    quote,
    { new: true }
  );
  return update_post;
};

/**
 *
 * @param {*} userId
 * @returns
 */
const getUserPost = async (userId) => {
  let userPosts = await quoteModel
    .find({ user: userId })
    .sort({ postDateUpdate: -1 });
  return userPosts;
};

/**
 *
 * @param {*} limit
 * @param {*} value
 * @returns
 */
const mostPost = async (limit, value) => {
  let value = value;
  let mostLike = await quoteModel.find().limit(limit).sort({ value: -1 });
  return mostLike;
};

/**
 *
 * @returns
 */
const randomPost = async () => {
  let quote = await quoteModel.find().populate("user").limit(4);
  return quote;
};

/**
 *
 * @returns
 */
const recentPost = async () => {
  const allposts = await quoteModel.find().populate("user");
  return allposts;
};

/**
 *
 * @param {*} userId
 * @returns
 */
const userPosts = async (userId) => {
  let post = await quoteModel
    .find({ user: userId })
    .sort({ postDateUpdate: -1 });
  return post;
};

/**
 *
 * @param {*} quoteId
 * @returns
 */
const postByTitle = async (quoteId) => {
  let quote = quoteModel
    .findOne({ _id: quoteId })
    .populate("user")
    .populate({
      path: "comments",
      options: {
        sort: {
          commentDateUpdate: -1,
        },
        populate: {
          path: "user",
        },
      },
    });
  return quote;
};

module.exports = {
  checkQuoteExists,
  createQuote,
  checkQuote,
  deleteQuote,
  updateQuote,
  getUserPost,
  mostPost,
  randomPost,
  recentPost,
  postByTitle,
  userPosts,
};
