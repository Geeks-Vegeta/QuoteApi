const likeRoute = require("express").Router();
const likeController = require("../controllers/likeController");

const verifyUser = require("../verifyUser");

likeRoute.post("/islike", verifyUser, likeController.likePost);
likeRoute.delete("/unlike/:post_id", verifyUser, likeController.unLike);

module.exports = likeRoute;
