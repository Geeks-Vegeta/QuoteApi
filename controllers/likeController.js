const ClientError = require("../responses/client-error");
const ServerError = require("../responses/server-error");
const sendResponse = require("../responses/send-response");
const logger = require("../utils/logger");
const validator = require("../validator/likeValidator");
const likeService = require("../services/likeService");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.likePost = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { quoteId } = req.body;

    const { error } = validator.likeValidator(req.body);
    if (error) {
      throw new ClientError(400, error.message);
    }

    const post = await likeService.checkPostLikeExists(quoteId, user_id);
    if (post) {
      throw new ClientError(400, "Already Like");
    }
    await likeService.giveLike(quoteId, user_id);
    return sendResponse(req, res, next, { message: "post liked" });
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
exports.unLike = async (req, res, next) => {
  try {
    let { user_id } = req.user;
    let { quoteId } = req.body;

    const { error } = validator.likeValidator(req.body);
    if (error) {
      throw new ClientError(400, error.message);
    }

    const post = await likeService.checkPostLikeExists(quoteId, user_id);
    if (!post) {
      throw new ClientError(400, "you did not like this post");
    }
    await likeService.removeLike(quoteId, user_id);
    return sendResponse(req, res, next, { message: "post unliked" });
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};
