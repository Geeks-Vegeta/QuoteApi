const jwt = require("jsonwebtoken");

/**
 *
 * @param {*} id
 * @returns
 */
async function generateToken(id) {
  const token = jwt.sign({ id: id }, process.env.TOKEN_SECRET);
  return token;
}

module.exports = {
  generateToken,
};
