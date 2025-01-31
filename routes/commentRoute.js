const commentRoute = require("express").Router();
const verifyUser = require("../middleware/verifyUser");
const { validateHmac } = require("../middleware/hmac-validator");
const { rateLimiter } = require("../middleware/rate-limit");
const commentController = require("../controllers/commentController");
const { enableUserAgentTracking } = require("../middleware/user-agent");

commentRoute.post(
  "/addcomment",
  [verifyUser, validateHmac, rateLimiter(5), enableUserAgentTracking],
  commentController.postComment
);
commentRoute.put(
  "/updatecomment",
  [verifyUser, validateHmac, rateLimiter(5), enableUserAgentTracking],
  commentController.updateComment
);
commentRoute.delete(
  "/deletecomment",
  [verifyUser, validateHmac, rateLimiter(5), enableUserAgentTracking],
  commentController.deleteComment
);
module.exports = commentRoute;
