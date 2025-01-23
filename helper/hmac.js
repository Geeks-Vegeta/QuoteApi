const crypto = require("crypto");

/**
 * Generates an HMAC (Hash-based Message Authentication Code)
 *
 * @param {string} message - The message to authenticate.
 * @param {string} [algorithm='sha256'] - The hashing algorithm (default is 'sha256').
 * @returns {string} - The generated HMAC in hexadecimal format.
 */
function generateHmac(message, algorithm = "sha256") {
  if (!message) {
    throw new Error("Message are required");
  }
  const secretKey = process.env.HMAC_SECRET_KEY;
  const hmac = crypto.createHmac(algorithm, secretKey);
  return hmac.update(message).digest("hex");
}

module.exports = generateHmac;
