const loginRoute = require("express").Router();

const loginController = require("../controllers/loginController");

loginRoute.post("/", loginController.loginUser);

/**
 * @swagger
 */
loginRoute.get("/logout", (req, res, next) => {
  res.clearCookie("Authorization", { path: "/" });
  res.status(200).send("logout");
});

module.exports = loginRoute;
