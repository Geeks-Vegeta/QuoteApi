const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

/**
 *
 * @param {*} userName
 * @returns boolean
 */
async function checkUserName(userName) {
  try {
    const usernameAlreadyPresent = await userModel.findOne({
      username: userName,
    });
    if (usernameAlreadyPresent) return true;
    return false;
  } catch (error) {
    console.log(error);
  }
}

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
 * @param {*} user
 * @returns
 */
async function createUser(user) {
  try {
    const newUser = new userModel(user);
    await newUser.save();
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  checkUserName,
  checkEmail,
  createUser,
};
