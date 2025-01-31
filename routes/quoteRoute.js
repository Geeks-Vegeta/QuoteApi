const quoteRoute = require("express").Router();
const quoteController = require("../controllers/quoteController");
const verifyUser = require("../middleware/verifyUser");
const { validateHmac } = require("../middleware/hmac-validator");
const { rateLimiter } = require("../middleware/rate-limit");
const { enableUserAgentTracking } = require("../middleware/user-agent");

quoteRoute.post(
  "/create",
  [verifyUser, validateHmac, rateLimiter(3), enableUserAgentTracking],
  quoteController.createPost
);
quoteRoute.delete(
  "/delete",
  [verifyUser, rateLimiter(10), enableUserAgentTracking],
  quoteController.deletePost
);
quoteRoute.put(
  "/update",
  [verifyUser, validateHmac, rateLimiter(5), enableUserAgentTracking],
  quoteController.updatePost
);
quoteRoute.get(
  "/allcurrentuserpost",
  [verifyUser, enableUserAgentTracking],
  quoteController.getAllCurrentUserPosts
);
quoteRoute.get(
  "/getpostbytitle",
  [verifyUser, enableUserAgentTracking],
  quoteController.getPostByTitle
);
quoteRoute.post(
  "/getposts",
  [verifyUser, validateHmac, enableUserAgentTracking],
  quoteController.getPosts
);

module.exports = quoteRoute;
