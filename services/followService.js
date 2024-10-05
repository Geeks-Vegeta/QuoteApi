const userModel = require("../models/userModel");

const checkUser = async (user_id) => {
  let user = await userModel.findOne({ _id: user_id });
  return user;
};

module.exports = {
  checkUser,
};
