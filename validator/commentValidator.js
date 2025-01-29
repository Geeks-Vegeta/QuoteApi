const Joi = require("joi");
const JoiOptions = require("../utils/joi/config.json");

const commentObj = Joi.object({
  quoteId: Joi.string().required(),
  comment: Joi.string().required(),
});

/**
 *
 * @param {*} reqBody
 */
function commentValidator(reqBody) {
  return commentObj.validate(reqBody, JoiOptions);
}

module.exports = {
  commentValidator,
};
