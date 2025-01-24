const Joi = require("joi");
const JoiOptions = require("../utils/joi/config.json");

const loginObj = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 *
 * @param {*} reqBody
 */
function loginValidator(reqBody) {
  return loginObj.validate(reqBody, JoiOptions);
}

module.exports = {
  loginValidator,
};
