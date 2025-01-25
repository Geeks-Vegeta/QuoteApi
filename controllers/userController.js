const userModel = require("../models/userModel");
const userService = require("../services/userService");
const bcrypt = require("../helper/bcrypt");
const ClientError = require("../responses/client-error");
const ServerError = require("../responses/server-error");
const sendResponse = require("../responses/send-response");
const logger = require("../utils/logger");
const validator = require("../validator/loginValidator");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.userUpdateProfile = async (req, res, next) => {
  try {
    let { user_id } = req.user;

    await userService.updateUser(user_id, req.body);
    return sendResponse(req, res, next, {
      message: "user updated successfully",
    });
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
exports.getUserId = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    return sendResponse(req, res, next, {
      user_id: user_id,
    });
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};

// get all users
exports.allUsers = async (req, res) => {
  try {
    const allusers = await userModel.find();
    res.send(allusers);
  } catch (error) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
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
  } catch (error) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  let { user_id } = req.params;
  try {
    const user = await userModel.findByIdAndDelete({ _id: user_id });
    if (!user)
      return res.status(404).json({ message: "This user does not exists" });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
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
    res.status(200).json({ message: "Password Changed Successfully" });
  } catch (error) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
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
    res.send(user);
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
exports.getUserById = async (req, res, next) => {
  let { user_id } = req.params;

  try {
    const userdata = await userService.getUserById(user_id);
    return sendResponse(req, res, next, userdata);
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
exports.checkPassword = async (req, res, next) => {
  let { user_id } = req.user;
  let { password } = req.body;

  try {
    let user = await userService.getUserById(user_id);
    const validatePassword = await bcrypt.comparePassword(
      password,
      user.password
    );
    if (!validatePassword) {
      throw new ClientError(401, "Invalid Password");
    }

    return sendResponse(req, res, next, {
      message: "Password is correct",
    });
  } catch (error) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};
