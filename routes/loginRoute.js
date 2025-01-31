const loginRoute = require("express").Router();
const loginController = require("../controllers/loginController");
const { validateHmac } = require("../middleware/hmac-validator");
const { rateLimiter } = require("../middleware/rate-limit");
const { enableUserAgentTracking } = require("../middleware/user-agent");

loginRoute.post(
  "/",
  [validateHmac, rateLimiter(3), enableUserAgentTracking],
  loginController.loginUser
);
loginRoute.get(
  "/logout",
  [validateHmac, rateLimiter(2), enableUserAgentTracking],
  loginController.logoutUser
);

module.exports = loginRoute;
