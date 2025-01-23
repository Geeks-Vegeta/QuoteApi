const jwt = require("../helper/jwt");
const bcrypt = require("../helper/bcrypt");
const userModel = require("../models/userModel");
const userService = require("../services/userService");
const ClientError = require("../responses/client-error");
const ServerError = require("../responses/server-error");
const sendResponse = require("../responses/send-response");
const Pagination = require("../utils/pagination");
const logger = require("../utils/logger");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    let user = await userService.checkEmail(email);
    if (!user) {
      throw new ClientError(401, "Invalid Email");
    }
    const isValidPassword = await bcrypt.comparePassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      throw new ClientError(401, "Invalid Password");
    }

    const token = await jwt.generateToken(user._id);
    return sendResponse(req, res, next, {
      token: token,
    });
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};
