const quoteModel = require("../models/quoteModel");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const moment = require("moment");

/**
 *
 * @param {*} quote
 * @returns {boolean}
 */
async function checkQuoteExists(quote) {
  try {
    const quoteAlreadyPresent = await quoteModel.findOne({
      quote: quote,
    });
    if (quoteAlreadyPresent) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
  }
}

/**
 *
 * @param {*} new_post
 */
async function createPost(new_post) {
  try {
    const post = new quoteModel({
      ...new_post,
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
    });
    await post.save();
  } catch (err) {
    console.log(err);
  }
}

/**
 *
 * @param {*} id
 * @returns
 */
async function getPostById(id) {
  try {
    const post = await quoteModel.findOne({ _id: new ObjectId(id) });
    return post;
  } catch (err) {
    console.log(err);
  }
}

/**
 *
 * @param {*} id
 */
async function deletePost(id) {
  try {
    let post = await quoteModel.deleteOne({ _id: new ObjectId(id) });
    return post;
  } catch (err) {
    console.log(err);
  }
}

/**
 *
 * @param {*} id
 * @param {*} reqBody
 * @returns
 */
async function updatePost(id, reqBody) {
  try {
    let post = await quoteModel.findByIdAndUpdate(
      { _id: new ObjectId(id) },
      { $set: reqBody },
      {
        new: true,
      }
    );
    return post;
  } catch (err) {
    console.log(err);
  }
}

/**
 *
 * @param {*} user_id
 * @returns
 */
async function userPosts(user_id) {
  try {
    const post = await quoteModel.aggregate([
      {
        $match: {
          user: new ObjectId(user_id),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          quote: 1,
        },
      },
    ]);
    return post;
  } catch (err) {
    console.log(err);
  }
}

/**
 *
 * @param {*} pipeline
 * @returns
 */
async function quoteAggregate(pipeline) {
  try {
    const post = await quoteModel.aggregate(pipeline);
    return post;
  } catch (err) {
    console.log(err);
  }
}

/**
 *
 * @param {*} filterData
 * @returns
 */
async function quoteDocumentCount(filterData) {
  try {
    const count = await quoteModel.countDocuments(filterData);
    return count;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  checkQuoteExists,
  createPost,
  getPostById,
  deletePost,
  updatePost,
  userPosts,
  quoteAggregate,
  quoteDocumentCount,
};
