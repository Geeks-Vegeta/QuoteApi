const jwt = require("../helper/jwt");
const bcrypt = require("../helper/bcrypt");
const userService = require("../services/userService");
const sessionService = require("../services/sessionService");
const ClientError = require("../responses/client-error");
const ServerError = require("../responses/server-error");
const sendResponse = require("../responses/send-response");
const logger = require("../utils/logger");
const validator = require("../validator/loginValidator");

/**
 *
 * @param {*} user
 * @returns
 */
function getUserData(user) {
  return {
    user_id: user._id,
    username: user.username,
    email: user.email,
  };
}

/**
 *
 * @param {*} user_id
 * @param {*} useragent
 * @param {*} token
 * @returns
 */
function createSessionPayload(user_id, useragent, token) {
  return {
    user: user_id,
    valid: true,
    useragent: useragent,
    token: token,
  };
}

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
    const { error } = validator.loginValidator(req.body);
    if (error) {
      throw new ClientError(400, error.message);
    }

    const [checkEmail, user] = await Promise.all([
      userService.checkEmail(email),
      userService.getUserByEmail(email),
    ]);

    if (!checkEmail) {
      throw new ClientError(401, "Invalid Email");
    }

    const isValidPassword = await bcrypt.comparePassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      throw new ClientError(401, "Invalid Password");
    }

    let userData = getUserData(user);

    const token = await jwt.generateToken(userData);
    // add here session and its token
    const sessionPayload = createSessionPayload(
      userData.user_id,
      req.useragent,
      token
    );
    await sessionService.addSession(sessionPayload);
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

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("Authorization", { path: "/" });
    return sendResponse(req, res, next, {
      message: "logout",
    });
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};
