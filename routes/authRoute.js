const router = require("express").Router();

const loginController = require("../controllers/loginController");
const registerController = require("../controllers/registerController");

router.post("/register", registerController.registerUser);
router.post("/login", loginController.loginUser);

router.get("/logout", (req, res) => {
  res.clearCookie("Authorization", { path: "/" });
  res.status(200).send("logout");
});

module.exports = router;
