const Joi = require("joi");
const JoiOptions = require("../utils/joi/config.json");

const quoteObj = Joi.object({
  quote: Joi.string().required(),
  tags: Joi.array(),
});

/**
 *
 * @param {*} reqBody
 */
function quoteValidator(reqBody) {
  return quoteObj.validate(reqBody, JoiOptions);
}

module.exports = {
  quoteValidator,
};
