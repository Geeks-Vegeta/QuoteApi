const userModel = require("../models/userModel");
const userService = require("../services/userService");
const bcrypt = require("../helper/bcrypt");
const ClientError = require("../responses/client-error");
const ServerError = require("../responses/server-error");
const sendResponse = require("../responses/send-response");
const logger = require("../utils/logger");
const validator = require("../validator/userValidator");

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

    const { error } = validator.userValidator(req.body);
    if (error) {
      throw new ClientError(400, error.message);
    }

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
  } catch (err) {
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
exports.archiveUser = async (req, res, next) => {
  let { user_id } = req.params;
  try {
    const user = await userService.archiveUserData(user_id);
    if (!user) {
      throw new ClientError(404, "This user does not exists");
    }

    return sendResponse(req, res, next, {
      message: "User Archived successfully",
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
exports.changeUserPassword = async (req, res, next) => {
  let { user_id } = req.user;
  let { password } = req.body;

  try {
    const { error } = validator.passwordValidator(req.body);
    if (error) {
      throw new ClientError(400, error.message);
    }

    const hashpassword = await bcrypt.generateHashPassword(password);
    let obj = {
      password: hashpassword,
    };
    await userService.updateUser(user_id, obj);
    return sendResponse(req, res, next, {
      message: "Password updated successfully",
    });
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};

// get current user
exports.currentUser = async (req, res, next) => {
  try {
    let { user_id } = req.user;

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
exports.getAUser = async (req, res, next) => {
  let { user_id } = req.params;

  try {
    // check if user exists
    const userdata = await userService.getUserById(user_id);
    if (!userdata) {
      throw new ClientError(404, "User not found");
    }
    return sendResponse(req, res, next, userdata);
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
exports.checkPassword = async (req, res, next) => {
  let { user_id } = req.user;
  let { password } = req.body;

  try {
    const { error } = validator.passwordValidator(req.body);
    if (error) {
      throw new ClientError(400, error.message);
    }

    let user = await userService.getUserPassword(user_id);
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
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};
