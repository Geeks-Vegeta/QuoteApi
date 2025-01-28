const quoteRoute = require("express").Router();
const quoteController = require("../controllers/quoteController");
const verifyUser = require("../middleware/verifyUser");

quoteRoute.post("/create", [verifyUser], quoteController.createPost);
quoteRoute.delete("/delete/:id", [verifyUser], quoteController.deletePost);
quoteRoute.put("/update/:id", [verifyUser], quoteController.updatePost);
quoteRoute.get(
  "/allcurrentuserpost",
  [verifyUser],
  quoteController.getAllCurrentUserPosts
);
quoteRoute.get("/getpostbytitle", [verifyUser], quoteController.getPostByTitle);
quoteRoute.post("/getposts", [verifyUser], quoteController.getPosts);

module.exports = quoteRoute;
