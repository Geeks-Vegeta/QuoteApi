const jwt = require("jsonwebtoken");
const ClientError = require("../utils/exceptions/client_error");
const ServerError = require("../utils/exceptions/server_error");
const logger = require("../utils/exceptions/logger");

const authenticateUser = (req, res, next) => {
  const excludedRoutes = ["/api/auth/login", "/api/auth/register"];

  if (excludedRoutes.includes(req.path)) {
    return next();
  }

  try {
    const auth = req.headers["x-auth-token"]?.split(" ")[1] || false;
    if (!auth) throw new ClientError(400, "Invalid Token");

    jwt.verify(auth, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        throw new ClientError(403, "Invalid access token");
      } else {
        req.user = decoded;
        next();
      }
    });
  } catch (err) {
    if (err instanceof ClientError) {
      logger.exception(err, req);
      throw new ClientError(403, err.message);
    }
    throw new ServerError(500, "", err.message);
  }
};

module.exports = authenticateUser;
