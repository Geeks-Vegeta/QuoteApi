const Joi = require("joi");
const JoiOptions = require("../utils/joi/config.json");

const passwordObj = Joi.object({
  password: Joi.string().required(),
});

const userObj = Joi.object({
  password: Joi.string(),
  education: Joi.string(),
  bio: Joi.string(),
  instagram_link: Joi.string(),
  twitter_link: Joi.string(),
  linkedIn_link: Joi.string(),
  github_link: Joi.string(),
  facebook_link: Joi.string(),
  gender: Joi.string().valid("Male", "Female"),
  username: Joi.string(),
  mobile_number: Joi.string(),
});

/**
 *
 * @param {*} reqBody
 */
function passwordValidator(reqBody) {
  return passwordObj.validate(reqBody, JoiOptions);
}

/**
 *
 * @param {*} reqBody
 */
function userValidator(reqBody) {
  return userObj.validate(reqBody, JoiOptions);
}

module.exports = {
  passwordValidator,
  userValidator,
};
