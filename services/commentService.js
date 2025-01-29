const quoteModel = require("../models/quoteModel");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const moment = require("moment");

/**
 *
 * @param {*} quoteId
 * @param {*} userId
 * @param {*} comment
 */
async function addComment(quoteId, userId, comment) {
  try {
    await quoteModel.findByIdAndUpdate(
      { _id: new ObjectId(quoteId) },
      {
        $push: {
          comments: {
            userId: userId,
            content: comment,
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
 * @param {*} comment
 */
async function deleteComment(quoteId, userId, comment) {
  try {
    await quoteModel.findByIdAndUpdate(
      { _id: new ObjectId(quoteId) },
      {
        $pull: {
          comments: { userId: userId, content: comment },
        },
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  addComment,
  deleteComment,
};
