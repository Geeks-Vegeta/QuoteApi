const service = require("../services/registerService");
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
exports.registerUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const { error } = validator.loginValidator(req.body);
    if (error) {
      throw new ClientError(400, error.message);
    }

    const [usernameAlreadyPresent, emailAlreadyPresent] = await Promise.all([
      await service.checkUserName(username),
      await service.checkEmail(email),
    ]);
    if (usernameAlreadyPresent) {
      throw new ClientError(401, "username already exists");
    }
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
