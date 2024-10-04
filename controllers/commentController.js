const commentService = require("../services/commentService");
const sendResponse = require("../utils/response/send_response");
const ClientError = require("../utils/exceptions/client_error");
const ServerError = require("../utils/exceptions/server_error");
const logger = require("../utils/exceptions/logger");

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.postComment = async (req, res) => {
  let userId = req.name.id;
  let { comment, postId } = req.body;

  try {
    let posts = await commentService.checkPost(postId);
    if (!posts) throw new ClientError(404, "Post does not exists");

    let commentData = {
      comment: comment,
      post: postId,
      user: userId,
    };
    let comments = await commentService.createComment(commentData);

    await posts.comments.push(comments);
    await posts.save();
    return sendResponse(req, res, next, comments);
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
exports.updateComment = async (req, res) => {
  let userId = req.name.id;
  let { commentId, comment } = req.body;

  try {
    let userComment = await commentService.checkComment(commentId);
    if (!userComment) {
      throw new ClientError(404, "This comment does not exists");
    }

    if (userComment.user == userId) {
      let update = await updateComment(commentId, comment);
      return sendResponse(req, res, next, update);
    } else {
      throw new ClientError(403, "You are not authorised to comment");
    }
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
exports.deleteComment = async (req, res) => {
  let userId = req.name.id;
  let { commentId, postId } = req.body;

  try {
    let userComment = await commentService.checkComment(commentId);
    if (!userComment) {
      throw new ClientError(404, "This comment does not exists");
    }

    if (isusercomment.user == userId) {
      await commentService.deleteComment(commentId);
      await commentService.deleteCommentPost(postId, commentId);
      return sendResponse(req, res, next, "Comment Deleted successfully");
    } else {
      throw new ClientError(403, "You are not authorised to comment");
    }
  } catch (error) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};
