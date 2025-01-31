const loginRoute = require("express").Router();
const loginController = require("../controllers/loginController");
const { validateHmac } = require("../middleware/hmac-validator");
const { rateLimiter } = require("../middleware/rate-limit");

loginRoute.post("/", [validateHmac, rateLimiter(3)], loginController.loginUser);
loginRoute.get(
  "/logout",
  [validateHmac, rateLimiter(2)],
  loginController.logoutUser
);

module.exports = loginRoute;
