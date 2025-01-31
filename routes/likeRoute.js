const likeRoute = require("express").Router();
const likeController = require("../controllers/likeController");
const verifyUser = require("../verifyUser");
const { validateHmac } = require("../middleware/hmac-validator");
const { enableUserAgentTracking } = require("../middleware/user-agent");

likeRoute.post(
  "/islike",
  [verifyUser, validateHmac, enableUserAgentTracking],
  likeController.likePost
);
likeRoute.delete(
  "/unlike",
  [verifyUser, validateHmac, enableUserAgentTracking],
  likeController.unLike
);

module.exports = likeRoute;
