const registerRoute = require("express").Router();
const registerController = require("../controllers/registerController");
const { validateHmac } = require("../middleware/hmac-validator");
const { rateLimiter } = require("../middleware/rate-limit");
const { enableUserAgentTracking } = require("../middleware/user-agent");

registerRoute.post(
  "/",
  [validateHmac, rateLimiter(3), enableUserAgentTracking],
  registerController.registerUser
);

module.exports = registerRoute;
