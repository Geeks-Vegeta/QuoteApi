const crypto = require("crypto");
const ClientError = require("../responses/client-error");
const ServerError = require("../responses/server-error");
const logger = require("../utils/logger");

/**
 *
 * @param {*} message
 * @param {*} secretKey
 * @param {*} algorithm
 * @returns
 */
function generateHmac(message, secretKey, algorithm = "sha256") {
  const hmac = crypto.createHmac(algorithm, secretKey);
  return hmac.update(message).digest("hex");
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function validateHmac(req, res, next) {
  try {
    const secretKey = process.env.HMAC_SECRET_KEY;
    let reqBody = req.body;
    const message = JSON.stringify(reqBody);
    const receivedHmac = req.headers["x-signature"];

    if (!receivedHmac) {
      throw new ClientError(400, "HMAC not provided in the signature header");
    }

    if (!message) {
      throw new ClientError(400, "Body Not Found");
    }

    const expectedHmac = generateHmac(message, secretKey);
    if (receivedHmac === expectedHmac) {
      return next();
    } else {
      throw new ClientError(401, "Invalid Signature");
    }
  } catch (err) {
    if (err instanceof ClientError) {
      throw err;
    }
    logger.exception(err);
    throw new ServerError(500, "", err.message);
  }
}

module.exports = {
  validateHmac,
};
