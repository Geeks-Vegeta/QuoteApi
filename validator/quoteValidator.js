const Joi = require("joi");
const JoiOptions = require("../utils/joi/config.json");

const sortColumn = Joi.string()
  .label("sortColumn")
  .valid("date", "like", "comments")
  .messages({
    "string.base": `sortColumn must be a type of string`,
  })
  .required();
const sortDirection = Joi.string()
  .label("sortDirection")
  .valid("asc", "desc")
  .messages({
    "string.base": `sortDirection must be a type of string`,
  })
  .required();

const quoteFilter = Joi.object().keys({
  tag: Joi.string(),
});

const quoteFilterObj = Joi.object({
  sortColumn: sortColumn,
  sortDirection: sortDirection,
  filter: quoteFilter,
});

const quoteObj = Joi.object({
  quote: Joi.string().required(),
  tags: Joi.array(),
});

const quoteIdObj = Joi.object({
  id: Joi.string().required(),
});

/**
 *
 * @param {*} reqBody
 */
function quoteValidator(reqBody) {
  return quoteObj.validate(reqBody, JoiOptions);
}

/**
 *
 * @param {*} reqBody
 */
function quoteIdValidator(reqBody) {
  return quoteIdObj.validate(reqBody, JoiOptions);
}

/**
 *
 * @param {*} reqBody
 */
function getQuoteValidator(reqBody) {
  return quoteFilterObj.validate(reqBody, JoiOptions);
}

module.exports = {
  quoteValidator,
  getQuoteValidator,
  quoteIdValidator,
};
