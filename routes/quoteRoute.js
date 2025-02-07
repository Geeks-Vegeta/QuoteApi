const quoteRoute = require("express").Router();
const quoteController = require("../controllers/quoteController");
const { checkUserPost } = require("../controllers/quoteController");
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
  [verifyUser, checkUserPost, rateLimiter(10), enableUserAgentTracking],
  quoteController.deletePost
);
quoteRoute.put(
  "/update",
  [
    verifyUser,
    validateHmac,
    checkUserPost,
    rateLimiter(5),
    enableUserAgentTracking,
  ],
  quoteController.updatePost
);
quoteRoute.post(
  "/allcurrentuserpost",
  [verifyUser, validateHmac, enableUserAgentTracking],
  quoteController.getAllCurrentUserPosts
);
quoteRoute.get(
  "/getsinglequote",
  [verifyUser, enableUserAgentTracking],
  quoteController.getSingleQuote
);
quoteRoute.post(
  "/getposts",
  [verifyUser, validateHmac, enableUserAgentTracking],
  quoteController.getPosts
);

module.exports = quoteRoute;
