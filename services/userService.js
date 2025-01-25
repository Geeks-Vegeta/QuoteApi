const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const bcrypt = require("bcryptjs");

/**
 *
 * @param {*} email
 * @returns {boolean}
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
 * @returns {object}
 */
async function getUserByEmail(email) {
  try {
    const user = await userModel.findOne({
      email: email,
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}

/**
 *
 * @param {*} user_id
 * @param {*} reqBody
 * @returns {object}
 */
async function updateUser(user_id, reqBody) {
  try {
    let user = await userModel.findByIdAndUpdate(
      { _id: new ObjectId(user_id) },
      reqBody,
      {
        new: true,
      }
    );
    return user;
  } catch (error) {
    console.log(error);
  }
}

/**
 *
 * @param {*} user_id
 */
async function getUserById(user_id) {
  try {
    const user = await userModel
      .findOne({ _id: new ObjectId(user_id) })
      .select(-password - __v - warning_number)
      .lean();
    return user;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  checkEmail,
  getUserByEmail,
  updateUser,
  getUserById,
};
