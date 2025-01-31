const registerRoute = require("express").Router();
const registerController = require("../controllers/registerController");
const { validateHmac } = require("../middleware/hmac-validator");
const { rateLimiter } = require("../middleware/rate-limit");

registerRoute.post(
  "/",
  [validateHmac, rateLimiter(3)],
  registerController.registerUser
);

module.exports = registerRoute;
