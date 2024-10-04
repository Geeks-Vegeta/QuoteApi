const quoteRoute = require("express").Router();

const quoteController = require("../controller/quoteController");

const verifyUser = require("../verifyUser");

quoteRoute.post("/create", verifyUser, quoteController.createPost);
quoteRoute.delete("/delete/:id", verifyUser, quoteController.deletePost);
quoteRoute.put("/update/:id", verifyUser, quoteController.updatePost);
quoteRoute.get(
  "/allcurrentuserpost",
  verifyUser,
  quoteController.getAllCurrentUserPosts
);
quoteRoute.get("/getpostbytitle", verifyUser, quoteController.getPostByTitle);
quoteRoute.get(
  "/getUserPostsById/:id",
  verifyUser,
  quoteController.getUserPostsById
);
quoteRoute.get("/getmostlikepost", quoteController.getMostLikedPosts);
quoteRoute.get("/getmostcommentpost", quoteController.getMostCommentedPosts);
quoteRoute.get("/getrandompost", quoteController.getRandomPosts);
quoteRoute.get("/getsinglerandompost", quoteController.getSingleRandomPosts);

// getUserPostsById
quoteRoute.get("/getAllRecentPosts", quoteController.getAllRecentPosts);

module.exports = quoteRoute;
