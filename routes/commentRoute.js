const commentRoute = require("express").Router();
const verifyUser = require("../middleware/verifyUser");
const { validateHmac } = require("../middleware/hmac-validator");
const { rateLimiter } = require("../middleware/rate-limit");
const commentController = require("../controllers/commentController");

commentRoute.post(
  "/addcomment",
  [verifyUser, validateHmac, rateLimiter(5)],
  commentController.postComment
);
commentRoute.put(
  "/updatecomment",
  [verifyUser, validateHmac, rateLimiter(5)],
  commentController.updateComment
);
commentRoute.delete(
  "/deletecomment",
  [verifyUser, validateHmac, rateLimiter(5)],
  commentController.deleteComment
);
module.exports = commentRoute;
