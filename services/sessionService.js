const sessionModel = require("../models/sessionModel");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const moment = require("moment");

/**
 *
 * @param {*} payload
 * @returns
 */
async function addSession(payload) {
  try {
    const session = new sessionModel({
      ...payload,
      createdAt: moment().unix(),
    });
    await session.save();
    return session;
  } catch (error) {
    console.log(error);
  }
}

/**
 *
 * @param {*} filterData
 * @returns
 */
async function sessionDocumentCount(filterData) {
  return await sessionModel.countDocuments(filterData);
}

/**
 *
 * @param {*} pipeline
 * @returns
 */
async function sessionAggregate(pipeline) {
  return await sessionModel.aggregate(pipeline);
}

module.exports = {
  addSession,
  sessionDocumentCount,
  sessionAggregate,
};
