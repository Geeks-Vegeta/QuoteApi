const ClientError = require("../responses/client-error");
const ServerError = require("../responses/server-error");
const sendResponse = require("../responses/send-response");
const logger = require("../utils/logger");
const validator = require("../validator/quoteValidator");
const quoteService = require("../services/quoteService");
const Pagination = require("../utils/pagination");

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

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.getPosts = async (req, res, next) => {
  try {
    const pageIndex = Number(req.query.pageIndex) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const offset = (pageIndex - 1) * pageSize;
    const { sortColumn, sortDirection, filter } = req.body;
    let sortData = {};
    let filterData = {};
    const pipeline = [];
    let direction = sortDirection === "asc" ? 1 : -1;

    const { error } = validator.getQuoteValidator(req.body);
    if (error) {
      throw new ClientError(400, error.message);
    }

    switch (sortColumn) {
      case "date":
        sortData["createdAt"] = direction; // most recent
        break;
      case "comments":
        sortData["comments"] = direction; // most commented
        break;
      case "like":
        sortData["like"] = direction; // most commented
        break;
      default:
        sortData["createdAt"] = -1;
    }

    if (Object.keys(filter).length > 0) {
      if ("tag" in filter) {
        filterData["tags.value"] = filter.tag; // tags
      }
    }
    pipeline.push({
      $match: filterData,
    });

    pipeline.push({
      $project: {
        _id: 1,
        quote: 1,
        like: 1,
        tags: 1,
        createdAt: 1,
        comments: { $size: "$comments" },
        likes: { $size: "$likes" },
      },
    });
    pipeline.push({
      $sort: sortData,
    });
    pipeline.push({
      $skip: offset,
    });
    pipeline.push({ $limit: pageSize });
    const totalColorCount = await quoteService.quoteDocumentCount(filterData);
    const colorTagList = await quoteService.quoteAggregate(pipeline);

    const pagination = new Pagination(
      sortColumn,
      sortDirection,
      totalColorCount,
      pageSize,
      pageIndex
    );

    return sendResponse(req, res, next, colorTagList, undefined, pagination);
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

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.getPostByTitle = async (req, res, next) => {
  let { _id } = req.query;

  try {
    const post = await quoteService.getPostById(_id);
    return sendResponse(req, res, next, post);
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};
