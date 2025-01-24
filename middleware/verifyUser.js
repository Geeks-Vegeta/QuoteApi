const jwt = require("jsonwebtoken");
const ClientError = require("../responses/client-error");
const ServerError = require("../responses/server-error");
const logger = require("../utils/logger");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.verifyUser = async (req, res, next) => {
  try {
    let auth = req.cookies.Authorization;
    if (!auth) return res.status(404).json({ message: "Invalid Token" });
    const verify = jwt.verify(auth, process.env.TOKEN_SECRET);
    req.name = verify;
    next();
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
exports.verifyAPI = async (req, res, next) => {
  try {
    const auth = req.headers["authorization"].split(" ")[1];
    if (!auth) return res.status(404).json({ message: "Invalid Token" });
    const verify = jwt.verify(auth, process.env.TOKEN_SECRET);
    req.name = verify;
    next();
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
};
