const quoteModel = require("../models/quoteModel");
const sendResponse = require("../utils/response/send_response");
const ClientError = require("../utils/exceptions/client_error");
const ServerError = require("../utils/exceptions/server_error");
const logger = require("../utils/exceptions/logger");
const quoteService = require("../services/quoteService");
const { client } = require("../redis-connection/connection_redis");

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.createPost = async (req, res) => {
  let { quote, tags } = req.body;
  const userId = req.name.id;

  // title validation
  const isQuotePresent = await quoteService.checkQuoteExists(quote);
  if (isQuotePresent) throw new ClientError(400, "Quote Already Present");

  try {
    const post = {
      quote: quote,
      tags: tags,
      user: userId,
    };
    await quoteService.createQuote(post);
    return sendResponse(req, res, next, "Quote created successfully");
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
exports.deletePost = async (req, res) => {
  let { quoteId } = req.body;
  let user_id = req.name.id;

  const isValidPost = await quoteService.checkQuote(quoteId);
  if (!isValidPost) throw new ClientError(404, "This post does not exists");

  try {
    if (user_id == isValidPost.user) {
      await quoteService.deleteQuote(quoteId);
      return sendResponse(req, res, next, "deleted successfully");
    } else {
      throw new ClientError(404, "This post does not exists");
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
exports.updatePost = async (req, res) => {
  let user_id = req.name.id;
  let { quote, quoteId } = req.body;

  const isValidPost = await quoteService.checkQuote(quoteId);
  if (!isValidPost) throw new ClientError(404, "This post does not exists");

  try {
    if (user_id == isValidPost.user) {
      let update_post = await quoteService.updateQuote(quoteId, quote);
      return sendResponse(req, res, next, update_post);
    } else {
      throw new ClientError(404, "unable to delete this post");
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
 */
exports.getUserPostsById = async (req, res) => {
  let { userId } = req.body;

  try {
    const userdata = quoteService.getUserPost(userId);
    return sendResponse(req, res, next, userdata);
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
 */
exports.getMostLikedPosts = async (req, res) => {
  try {
    const allposts = await quoteService.mostPost(4, like);
    return sendResponse(req, res, next, allposts);
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
 */
exports.getMostCommentedPosts = async (req, res) => {
  try {
    const allposts = await quoteService.mostPost(4, comment);
    return sendResponse(req, res, next, allposts);
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
exports.getSingleRandomPosts = async (req, res) => {
  try {
    const allposts = await quoteService.randomPost();
    return sendResponse(req, res, next, allposts);
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
exports.getRandomPosts = async (req, res) => {
  try {
    let randnumber = Math.floor(Math.random() * 10);
    const allposts = await quoteModel.find().limit(20).skip(randnumber);
    const getRes = await client.get("randompost");
    if (getRes) {
      return sendResponse(req, res, next, JSON.parse(getRes));
    } else {
      await client.set("randompost", JSON.stringify(allposts), "EX", 3600);
      return sendResponse(req, res, next, allposts);
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
exports.getAllRecentPosts = async (req, res) => {
  try {
    const allposts = await quoteService.recentPost();
    return sendResponse(req, res, next, allposts);
    // }
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
exports.getAllCurrentUserPosts = async (req, res) => {
  try {
    let user_id = req.name.id;
    const allposts = await quoteService.userPosts(user_id);
    const getRes = await client.get("currentuserquotes");
    if (getRes) {
      return sendResponse(req, res, next, JSON.parse(getRes));
    } else {
      await client.set("currentuserquotes", JSON.stringify(allposts));
      return sendResponse(req, res, next, allposts);
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
exports.getPostByTitle = async (req, res) => {
  let { quoteId } = req.body;

  try {
    const allpost = await quoteService.postByTitle(quoteId);
    return sendResponse(req, res, next, allpost);
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};
