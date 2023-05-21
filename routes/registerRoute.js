const registerRoute = require('express').Router();

const registerController = require('../controller/registerController');


registerRoute.post("/", registerController.registerUser)

module.exports=registerRoute;