const quoteRoute = require("express").Router();
const quoteController = require("../controllers/quoteController");
const verifyUser = require("../middleware/verifyUser");
const { validateHmac } = require("../middleware/hmac-validator");
const { rateLimiter } = require("../middleware/rate-limit");

quoteRoute.post(
  "/create",
  [verifyUser, validateHmac, rateLimiter(3)],
  quoteController.createPost
);
quoteRoute.delete(
  "/delete/:id",
  [verifyUser, rateLimiter(15)],
  quoteController.deletePost
);
quoteRoute.put(
  "/update/:id",
  [verifyUser, validateHmac, rateLimiter(5)],
  quoteController.updatePost
);
quoteRoute.get(
  "/allcurrentuserpost",
  [verifyUser],
  quoteController.getAllCurrentUserPosts
);
quoteRoute.get("/getpostbytitle", [verifyUser], quoteController.getPostByTitle);
quoteRoute.post("/getposts", [verifyUser], quoteController.getPosts);

module.exports = quoteRoute;
