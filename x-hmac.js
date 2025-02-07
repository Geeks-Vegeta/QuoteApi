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
  const secretKey =
    "986de61a-6e4c-4d36-b700-0c8c24e78e4e-52a728b5-3a4c-4875-99ff-d67312c31a88";
  const hmac = crypto.createHmac(algorithm, secretKey);
  return hmac.update(message).digest("hex");
}

const message = {
  id: "67a5cd9ff164d6660b7f63e9",
};
const expectedHmac = generateHmac(JSON.stringify(message));
console.log(expectedHmac);
