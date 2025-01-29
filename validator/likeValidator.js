const Joi = require("joi");
const JoiOptions = require("../utils/joi/config.json");

const likeObj = Joi.object({
  quoteId: Joi.string().required(),
});

/**
 *
 * @param {*} reqBody
 */
function likeValidator(reqBody) {
  return likeObj.validate(reqBody, JoiOptions);
}

module.exports = {
  likeValidator,
};
