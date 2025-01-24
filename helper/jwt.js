const jwt = require("jsonwebtoken");

/**
 *
 * @param {*} user
 * @returns
 */
async function generateToken(user) {
  const token = jwt.sign({ user }, process.env.TOKEN_SECRET);
  return token;
}

module.exports = {
  generateToken,
};
