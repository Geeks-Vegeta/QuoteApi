const likeRoute = require("express").Router();

const likeController = require("../controllers/likeController");

const verifyUser = require("../verifyUser");

likeRoute.post("/like", verifyUser, likeController.likePost);
likeRoute.delete("/unlike", verifyUser, likeController.unLike);

module.exports = likeRoute;
