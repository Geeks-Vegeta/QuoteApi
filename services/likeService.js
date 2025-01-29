const quoteModel = require("../models/quoteModel");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const moment = require("moment");

/**
 *
 * @param {*} quoteId
 * @param {*} userId
 */
async function checkPostLikeExists(quoteId, userId) {
  try {
    const post = await quoteModel.findOne({
      _id: quoteId,
      "likes.userId": userId,
    });
    return post;
  } catch (err) {
    console.log(err);
  }
}

/**
 *
 * @param {*} quoteId
 * @param {*} userId
 */
async function giveLike(quoteId, userId) {
  try {
    await quoteModel.findByIdAndUpdate(
      { _id: new ObjectId(quoteId) },
      {
        $push: {
          likes: {
            userId: userId,
            createdAt: moment().unix(),
          },
        },
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  }
}

/**
 *
 * @param {*} quoteId
 * @param {*} userId
 */
async function removeLike(quoteId, userId) {
  try {
    await quoteModel.findByIdAndUpdate(
      { _id: new ObjectId(quoteId) },
      {
        $pull: {
          likes: { userId: userId },
        },
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  checkPostLikeExists,
  giveLike,
  removeLike,
};
