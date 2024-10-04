const jwt = require("jsonwebtoken");
const userService = require("../services/authService");
const {
  comparePassword,
  hashedPassword,
} = require("../utils/helper/bcrypt_password");
const sendResponse = require("../utils/response/send_response");
const ClientError = require("../utils/exceptions/client_error");
const ServerError = require("../utils/exceptions/server_error");
const logger = require("../utils/exceptions/logger");

exports.loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let user = await userService.checkEmail(email);
    if (!user) throw new ClientError(401, "Invalid Email");

    let isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) throw new ClientError(401, "Invalid Password");

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
    return sendResponse(req, res, next, token);
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
 */
exports.registerUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const usernameAlreadyPresent = await userService.checkUserName(username);
    if (usernameAlreadyPresent) {
      throw new ClientError(401, "Username already exists");
    }

    let emailAlreadyPresent = await userService.checkEmail(email);
    if (emailAlreadyPresent) {
      throw new ClientError(401, "Given email already exists");
    }
    // creating salt
    let userhashedPassword = await hashedPassword(password);

    let newuser = {
      username: username,
      email: email,
      password: userhashedPassword,
    };
    await userService.createNewUser(newuser);
    return sendResponse(req, res, next, "user created successfully");
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};
