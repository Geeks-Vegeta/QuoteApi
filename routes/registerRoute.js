const registerRoute = require("express").Router();

const registerController = require("../controllers/registerController");

registerRoute.post("/", registerController.registerUser);

module.exports = registerRoute;
