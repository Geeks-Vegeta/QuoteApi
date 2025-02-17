const sessionRoute = require("express").Router();
const sessionController = require("../controllers/sessionController");
const verifyUser = require("../middleware/verifyUser");
const { validateHmac } = require("../middleware/hmac-validator");

sessionRoute.post(
  "/allusersession",
  [verifyUser, validateHmac],
  sessionController.getUserSession
);

module.exports = sessionRoute;
