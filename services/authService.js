const userModel = require("../models/userModel");

/**
 *
 * @param {*} userEmail
 */
const checkEmail = async (userEmail) => {
  let user = await userModel.findOne({ email: userEmail });
  return user;
};

/**
 *
 * @param {*} userName
 * @returns
 */
const checkUserName = async (userName) => {
  const user = await userModel.findOne({
    username: userName,
  });
  return user;
};

/**
 *
 * @param {*} reqBody
 * @returns
 */
const createNewUser = async (reqBody) => {
  let newuser = await userModel(reqBody);
  await newuser.save();
  return newuser;
};

module.exports = {
  checkEmail,
  checkUserName,
  createNewUser,
};
