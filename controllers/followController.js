const userModel = require("../models/userModel");
const followService = require("../services/followService");
const sendResponse = require("../utils/response/send_response");
const ClientError = require("../utils/exceptions/client_error");
const ServerError = require("../utils/exceptions/server_error");
const logger = require("../utils/exceptions/logger");
const mongoose = require("mongoose");

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.followeruser = async (req, res) => {
  let { followId } = req.body;
  let user_id = req.name.id;

  try {
    if (followId == user_id) {
      throw new ClientError(404, "unable to follow both ids are same");
    }
    let userfollow = await followService.checkUser({ _id: user_id });
    let userwhofollow = await followService.checkUser({ _id: followId });
    if (!userfollow) new ClientError(404, "no user found");
    if (!userwhofollow) new ClientError(404, "no user found");

    // mongoose.Types.ObjectId
    await userfollow.following.push(mongoose.Types.ObjectId(followId));
    await userwhofollow.followers.push(mongoose.Types.ObjectId(user_id));
    await userfollow.save();
    await userwhofollow.save();
    return sendResponse(req, res, next, "followed successfully");
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
exports.unfollowuser = async (req, res) => {
  let { followId } = req.body;
  let user_id = req.name.id;

  try {
    let user = await userModel.findOne({ _id: user_id });
    if (!user) new ClientError(404, "no user found");

    await userModel.findByIdAndUpdate(
      { _id: user_id },
      { $pull: { following: mongoose.Types.ObjectId(followId) } }
    );
    await userModel.findByIdAndUpdate(
      { _id: followId },
      { $pull: { followers: mongoose.Types.ObjectId(user_id) } }
    );
    return sendResponse(req, res, next, "Follower removed successfully");
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};
