const router = require("express").Router();
const authController = require("../controllers/authController");
const { rateLimiter } = require("../middleware/ratelimit");

router.post("/register", rateLimiter(2), authController.registerUser);
router.post("/login", rateLimiter(2), authController.loginUser);
module.exports = router;
