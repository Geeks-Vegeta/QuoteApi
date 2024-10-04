const rateLimit = require("express-rate-limit");

function rateLimiter(reqCount, ms) {
  return rateLimit({
    windowMs: ms || 1 * 60 * 1000, // 1 minutes
    max: reqCount || 2, // limit each IP to 2 requests per windowMs
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
