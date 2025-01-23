const service = require("../services/registerService");
const bcrypt = require("../helper/bcrypt");
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
exports.registerUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const usernameAlreadyPresent = await service.checkUserName(username);
    if (usernameAlreadyPresent) {
      throw new ClientError(401, "username already exists");
    }

    const emailAlreadyPresent = await service.checkEmail(email);
    if (emailAlreadyPresent) {
      throw new ClientError(401, "email already exists");
    }

    const hashpassword = await bcrypt.generateHashPassword(password);
    let newuser = {
      username: username,
      email: email,
      password: hashpassword,
    };
    await service.createUser(newuser);
    return sendResponse(req, res, next, {
      message: "user created successfully",
    });
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};
