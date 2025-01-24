const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

/**
 *
 * @param {*} email
 * @returns boolean
 */
async function checkEmail(email) {
  try {
    const userEmailAlreadyExists = await userModel.findOne({
      email: email,
    });
    if (userEmailAlreadyExists) return true;
    return false;
  } catch (error) {
    console.log(error);
  }
}

/**
 *
 * @param {*} email
 * @returns
 */
async function checkUser(email) {
  try {
    const user = await userModel.findOne({
      email: email,
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  checkEmail,
  checkUser,
};
