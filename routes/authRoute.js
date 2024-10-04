const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

router.get("/logout", (req, res) => {
  res.clearCookie("Authorization", { path: "/" });
  res.status(200).send("logout");
});

module.exports = router;
