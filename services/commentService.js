const commentModel = require("../models/commentModel");
const postModel = require("../models/quoteModel");

/**
 *
 * @param {*} postId
 * @returns
 */
const checkPost = async (postId) => {
  let posts = await postModel.findOne({ _id: postId });
  return posts;
};

/**
 *
 * @param {*} reqData
 * @returns
 */
const createComment = async (reqData) => {
  let commenting = await commentModel(reqData);
  await commenting.save();
  return commenting;
};

/**
 *
 * @param {*} commentId
 * @returns
 */
const checkComment = async (commentId) => {
  let comment = await commentModel.findOne({ _id: commentId });
  return comment;
};

/**
 *
 * @param {*} commentId
 * @param {*} comment
 * @returns
 */
const updateComment = async (commentId, comment) => {
  let comment = await commentModel.findByIdAndUpdate(
    { _id: commentId },
    comment,
    { new: true }
  );
  return comment;
};

/**
 *
 * @param {*} commentId
 * @returns
 */
const deleteComment = async (commentId) => {
  let comment = await commentModel.findByIdAndDelete({ _id: commentId });
  return comment;
};

/**
 *
 * @param {*} postId
 * @param {*} commentId
 * @returns
 */
const deleteCommentPost = async (postId, commentId) => {
  let postComment = await postModel.findByIdAndUpdate(
    { _id: postId },
    { $pull: { comments: commentId } }
  );
  return postComment;
};

module.exports = {
  checkPost,
  createComment,
  checkComment,
  updateComment,
  deleteComment,
  deleteCommentPost,
};
