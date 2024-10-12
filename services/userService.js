const userModel = require("../models/userModel");

/**
 *
 * @param {*} userId
 * @param {*} reqBody
 * @returns
 */
const updateProfile = async (userId, reqBody) => {
  const update = await userModel.findByIdAndUpdate(
    { _id: userId },
    { $set: { reqBody } },
    {
      new: true,
    }
  );
  return update;
};

/**
 *
 * @param {*} follow1
 * @param {*} follow2
 * @returns
 */
const updatefollowing = async (follow1, follow2) => {
  let ol = await userModel.findByIdAndUpdate(follow1, {
    $push: { following: follow2 },
  });
  return ol;
};

/**
 *
 * @returns
 */
const getAllUser = async () => {
  const allusers = await userModel.find();
  return allusers;
};

/**
 *
 * @param {*} user_id
 * @returns
 */
const deleteUser = async (user_id) => {
  const del = await userModel.findByIdAndDelete({ _id: user_id });
  return del;
};

/**
 *
 * @param {*} user_id
 * @returns
 */
const getCurrentUser = async (user_id) => {
  const user = await userModel
    .findOne({ _id: user_id }, "-password")
    .populate(
      "followers",
      "_id profile_pic username following followers",
      "User"
    )
    .populate("following", "_id profile_pic username", "User");
  return user;
};

/**
 *
 * @param {*} user_id
 * @returns
 */
const checkUser = async (user_id) => {
  let user = await userModel.findOne({ _id: user_id });
  return user;
};
module.exports = {
  updateProfile,
  getAllUser,
  deleteUser,
  checkUser,
  getCurrentUser,
  updatefollowing,
};
