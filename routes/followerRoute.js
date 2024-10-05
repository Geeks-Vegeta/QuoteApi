const followerRoute = require("express").Router();
const authenticateUser = require("../middleware/authenticate");
const { rateLimiter } = require("../middleware/ratelimit");
const followController = require("../controllers/followController");

followerRoute.put(
  "/follow",
  [authenticateUser, rateLimiter(30)],
  followController.followeruser
);
followerRoute.put(
  "/unfollow",
  [authenticateUser, rateLimiter(30)],
  followController.unfollowuser
);
module.exports = followerRoute;
