const userModel = require("../models/userModel");
const sendResponse = require("../utils/response/send_response");
const ClientError = require("../utils/exceptions/client_error");
const ServerError = require("../utils/exceptions/server_error");
const logger = require("../utils/exceptions/logger");

const bcrypt = require("bcryptjs");

// userupdate profile
exports.userUpdateProfile = async (req, res) => {
  try {
    let userId = req.name.id;

    const updateProfile = await userModel.findByIdAndUpdate(
      { _id: userId },
      req.body,
      {
        new: true,
      }
    );
    return sendResponse(req, res, next, updateProfile);
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};

// get user id
exports.getUserId = async (req, res) => {
  try {
    const user_id = req.name.id;
    return sendResponse(req, res, next, user_id);
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};

// get all users
exports.allUsers = async (req, res) => {
  try {
    const allusers = await userModel.find();
    return sendResponse(req, res, next, allusers);
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};

// user follow /unfollow
exports.userFollowUnfollow = async (req, res) => {
  const following = req.name.id;

  const { follow, action } = req.body;

  try {
    switch (action) {
      case "follow":
        await userModel.findByIdAndUpdate(follow, {
          $push: { following: following },
        }),
          await userModel.findByIdAndUpdate(following, {
            $push: { follow: follow },
          });
        break;
      case "unfollow":
        await userModel.findByIdAndUpdate(follow, {
          $pull: { following: following },
        }),
          await userModel.findByIdAndUpdate(following, {
            $pull: { follow: follow },
          });
        break;
      default:
        break;
    }
    return sendResponse(req, res, next, "updated successfully");
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  let { user_id } = req.body;
  try {
    const user = await userModel.findByIdAndDelete({ _id: user_id });
    if (!user) throw new ClientError(404, "This user does not exists");

    return sendResponse(req, res, next, "Deleted successfully");
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};

// update userpassword
exports.changeUserPassword = async (req, res) => {
  let user_id = req.name.id;
  let { password } = req.body;

  try {
    let salt = await bcrypt.genSaltSync(13);
    let hashpassword = await bcrypt.hash(password, salt);

    await userModel.findByIdAndUpdate(
      { _id: user_id },
      { $set: { password: hashpassword } }
    );
    return sendResponse(req, res, next, "Password Changed Successfully");
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};

// get current user
exports.currentUser = async (req, res) => {
  let user_id = req.name.id;

  try {
    const user = await userModel
      .findOne({ _id: user_id }, "-password")
      .populate(
        "followers",
        "_id profile_pic username following followers",
        "User"
      )
      .populate("following", "_id profile_pic username", "User");
    return sendResponse(req, res, next, user);
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};

// get user by id
exports.getUserById = async (req, res) => {
  let { user_id } = req.body;

  try {
    const userdata = await userModel.findById({ _id: user_id });
    return sendResponse(req, res, next, userdata);
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};

// check password
exports.checkPassword = async (req, res) => {
  let { user_id } = req.params;
  let { password } = req.body;

  try {
    let user = await userModel.findOne({ _id: user_id });

    let isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new ClientError(401, "Invalid Password");
    return sendResponse(req, res, next, userdata);
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};
