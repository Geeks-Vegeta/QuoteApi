const router = require("express").Router();
const authenticateUser = require("../middleware/authenticate");
const { rateLimiter } = require("../middleware/ratelimit");
const commentController = require("../controllers/commentController");

router.post(
  "/addcomment",
  [authenticateUser, rateLimiter(20)],
  commentController.postComment
);
router.put(
  "/updatecomment",
  [authenticateUser, rateLimiter(20)],
  commentController.updateComment
);
router.delete(
  "/deletecomment",
  [authenticateUser, rateLimiter(20)],
  commentController.deleteComment
);

module.exports = router;
