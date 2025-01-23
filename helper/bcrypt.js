const bcrypt = require("bcryptjs");
/**
 *
 * @param {*} password
 * @returns
 */
async function generateHashPassword(password) {
  let salt = bcrypt.genSaltSync(13);
  let hashpassword = await bcrypt.hash(password, salt);
  return hashpassword;
}

/**
 *
 * @param {*} password
 * @param {*} hashpassword
 * @returns
 */
async function comparePassword(password, hashpassword) {
  let isValidPassword = await bcrypt.compare(password, hashpassword);
  return isValidPassword;
}

module.exports = {
  generateHashPassword,
  comparePassword,
};
