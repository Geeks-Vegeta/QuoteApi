const rateLimit = require("express-rate-limit");

/**
 *
 * @param {*} reqCount
 * @param {*} ms
 * @returns
 */
function rateLimiter(reqCount, ms) {
  return rateLimit({
    windowMs: ms || 1 * 60 * 1000,
    max: reqCount || 2,
    message: {
      data: {
        item: {},
      },
      status: {
        type: "error",
        message: "Too many requests, please try again later.",
        description: "Too Many Requests",
      },
    },
  });
}

module.exports = {
  rateLimiter,
};
