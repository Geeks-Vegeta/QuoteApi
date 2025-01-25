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
const verifyUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return next(new ClientError(401, "Authorization header missing"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new ClientError(401, "Token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ClientError(401, "Invalid Token"));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ClientError(401, "Token expired"));
    }
    logger.exception(error);
    return next(new ServerError(500, "Internal Server Error", error.message));
  }
};

module.exports = verifyUser;
