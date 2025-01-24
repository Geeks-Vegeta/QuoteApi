const Joi = require("joi");
const JoiOptions = require("../utils/joi/config.json");

const registerObj = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 *
 * @param {*} reqBody
 */
function registerValidator(reqBody) {
  return registerObj.validate(reqBody, JoiOptions);
}

module.exports = {
  registerValidator,
};
