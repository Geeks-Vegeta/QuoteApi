const router = require("express").Router();
const authController = require("../controllers/authController");
const { rateLimiter } = require("../middleware/ratelimit");

router.post("/register", rateLimiter(2), authController.registerUser);
router.post("/login", rateLimiter(2), authController.loginUser);
router.get("/logout", (req, res) => {
  res.clearCookie("Authorization", { path: "/" });
  res.status(200).send("logout");
});

module.exports = router;
