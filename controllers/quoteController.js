const quoteModel = require("../models/quoteModel");
const ClientError = require("../responses/client-error");
const ServerError = require("../responses/server-error");
const sendResponse = require("../responses/send-response");
const logger = require("../utils/logger");
const validator = require("../validator/quoteValidator");
const quoteService = require("../services/quoteService");
const { client } = require("../redis-connection/connection_redis");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {object}
 */
exports.createPost = async (req, res, next) => {
  try {
    let { quote, tags } = req.body;
    const { user_id } = req.user;

    const { error } = validator.quoteValidator(req.body);
    if (error) {
      throw new ClientError(400, error.message);
    }

    const isQuotePresent = await quoteService.checkQuoteExists(quote);
    if (isQuotePresent) {
      throw new ClientError(400, "Quote Already Present");
    }

    const new_post = {
      quote: quote,
      tags: tags,
      user: user_id,
    };
    await quoteService.createPost(new_post);
    return sendResponse(req, res, next, {
      message: "Post created successfully",
    });
  } catch (error) {
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
exports.deletePost = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { user_id } = req.user;

    const isValidPost = await quoteService.getPostById(id);
    if (!isValidPost) {
      throw new ClientError(404, "This post does not exists");
    }

    if (user_id == isValidPost.user) {
      await quoteService.deletePost(id);
      return sendResponse(req, res, next, {
        message: "Post deleted successfully",
      });
    } else {
      throw new ClientError(404, "can't delete");
    }
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
exports.updatePost = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { user_id } = req.user;

    const isValidPost = await quoteService.getPostById(id);
    if (!isValidPost) {
      throw new ClientError(404, "This post does not exists");
    }
    if (user_id == isValidPost.user) {
      await quoteService.updatePost(id, req.body);
      return sendResponse(req, res, next, {
        message: "Post updated successfully",
      });
    } else {
      throw new ClientError(404, "can't update");
    }
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
exports.getAllUserPosts = async (req, res, next) => {
  try {
    let { id } = req.params;
    const userData = await quoteService.userPosts(id);
    return sendResponse(req, res, next, userData);
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};

// most liked posts
exports.getMostLikedPosts = async (req, res) => {
  try {
    const allposts = await quoteModel.find().limit(4).sort({ like: -1 });
    res.send(allposts);
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};

exports.getMostCommentedPosts = async (req, res) => {
  try {
    const allposts = await quoteModel.find().limit(4).sort({ comments: -1 });
    res.send(allposts);
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};

exports.getSingleRandomPosts = async (req, res) => {
  try {
    const allposts = await quoteModel.find().populate("user").limit(4);
    res.send(allposts);
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};

exports.getRandomPosts = async (req, res) => {
  try {
    let randnumber = Math.floor(Math.random() * 10);
    const allposts = await quoteModel.find().limit(20).skip(randnumber);
    const getRes = await client.get("randompost");
    if (getRes) {
      return res.send(JSON.parse(getRes));
    } else {
      await client.set("randompost", JSON.stringify(allposts), "EX", 3600);
      return res.status(200).send(allposts);
    }
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
 * @returns {object}
 */
exports.getAllRecentPosts = async (req, res, next) => {
  try {
    const allposts = await quoteModel
      .find()
      .populate("user")
      .sort({ postDateUpdate: -1 });

    return res.status(200).send(allposts);
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
exports.getAllCurrentUserPosts = async (req, res, next) => {
  try {
    let { user_id } = req.user;
    const allposts = await quoteService.userPosts(user_id);
    return sendResponse(req, res, next, allposts);
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};

// get post by title
exports.getPostByTitle = async (req, res) => {
  let { _id } = req.query;

  try {
    const allpost = await quoteModel
      .findOne({ _id: _id })
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
    res.status(200).send(allpost);
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};
