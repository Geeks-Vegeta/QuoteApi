const postModel = require("../models/quoteModel");
const likeModel = require("../models/likeModel");

/**
 *
 * @param {*} user_id
 * @param {*} post_id
 * @returns
 */
const createLike = async (user_id, post_id) => {
  let liked = likeModel({
    user: user_id,
    post: post_id,
  });
  await liked.save();
  return liked;
};

/**
 *
 * @param {*} post_id
 * @returns
 */
const updatePostLikeIncrement = async (post_id) => {
  let updateLike = await postModel.findByIdAndUpdate(
    { _id: post_id },
    { $inc: { like: 1 } }
  );
  return updateLike;
};

/**
 *
 * @param {*} userId
 * @param {*} postId
 * @returns
 */
const checkUserLike = async (userId, postId) => {
  const likeuser = await likeModel.findOne({ post: postId, user: userId });
  return likeuser;
};

/**
 *
 * @param {*} postId
 * @param {*} userId
 * @returns
 */
const updatePostLikeDecrement = async (userId, postId) => {
  let updateLike = await postModel.findByIdAndUpdate(
    { _id: postId },
    { $pull: { likes: userId }, $inc: { like: -1 } }
  );
  return updateLike;
};

/**
 *
 * @param {*} userId
 * @param {*} postId
 * @returns
 */
const deleteLike = async (userId, postId) => {
  let like = await likeModel.deleteOne({ user: userId, post: postId });
  return like;
};

module.exports = {
  createLike,
  updatePostLikeIncrement,
  checkUserLike,
  updatePostLikeDecrement,
  deleteLike,
};
