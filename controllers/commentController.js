const ClientError = require("../responses/client-error");
const ServerError = require("../responses/server-error");
const sendResponse = require("../responses/send-response");
const logger = require("../utils/logger");
const validator = require("../validator/commentValidator");
const commentService = require("../services/commentService");
const quoteService = require("../services/quoteService");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.postComment = async (req, res, next) => {
  try {
    const { quoteId, comment } = req.body;
    const { user_id } = req.user;

    const { error } = validator.commentValidator(req.body);
    if (error) {
      throw new ClientError(400, error.message);
    }

    if (!comment || comment.trim().length === 0) {
      throw new ClientError(400, "Comment content cannot be empty.");
    }

    const quote = await quoteService.getPostById(quoteId);
    if (!quote) {
      throw new ClientError(404, "This post does not exists");
    }
    await commentService.addComment(quoteId, user_id, comment);
    return sendResponse(req, res, next, { message: "commented successfully" });
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.deleteComment = async (req, res, next) => {
  try {
    let { user_id } = req.user;
    let { quoteId, comment } = req.body;

    const { error } = validator.commentValidator(req.body);
    if (error) {
      throw new ClientError(400, error.message);
    }

    const quote = await quoteService.getPostById(quoteId);
    if (!quote) {
      throw new ClientError(404, "This post does not exists");
    }
    await commentService.deleteComment(quoteId, user_id, comment);
    return sendResponse(req, res, next, {
      message: "comment deleted successfully",
    });
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};
