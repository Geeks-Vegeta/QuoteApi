const postModel = require("../models/quoteModel");
const sendResponse = require("../utils/response/send_response");
const ClientError = require("../utils/exceptions/client_error");
const ServerError = require("../utils/exceptions/server_error");
const logger = require("../utils/exceptions/logger");
const likeService = require("../services/likeService");

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.likePost = async (req, res) => {
  let userId = req.name.id;
  let { postId } = req.body;
  let posts = await postModel.findOne({ _id: postId });

  try {
    await likeService.createLike(userId, postId);
    await likeService.updatePostLikeIncrement(postId);
    await posts.likes.push(userId);
    await posts.save();
    return sendResponse(req, res, next, "liked");
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.unLike = async (req, res) => {
  let userId = req.name.id;
  let { postId } = req.body;

  try {
    const likeuser = await likeService.checkUserLike(userId, postId);
    if (!likeuser) throw new ClientError(404, "No such like");

    if (likeuser.user == userId) {
      await likeService.updatePostLikeDecrement(userId, postId);
      await likeService.deleteLike(userId, postId);
      return sendResponse(req, res, next, "Deleted Like successfully");
    } else {
      throw new ClientError(404, "Cant Delete this like");
    }
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};
