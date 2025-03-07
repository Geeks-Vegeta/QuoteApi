const followerRoute = require("express").Router();

const verifyUser = require("../verifyUser");

const followController = require("../controllers/followController");

followerRoute.put("/:id", verifyUser, followController.followeruser);
followerRoute.put("/unfollow/:id", verifyUser, followController.unfollowuser);
module.exports = followerRoute;
