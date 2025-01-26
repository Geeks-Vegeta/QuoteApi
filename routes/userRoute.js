const userRoute = require("express").Router();
const userController = require("../controllers/userController");
const verifyUser = require("../middleware/verifyUser");
const { rateLimiter } = require("../middleware/rate-limit");
const { validateHmac } = require("../middleware/hmac-validator");
const { enableUserAgentTracking } = require("../middleware/user-agent");

// user update profile
userRoute.put(
  "/update",
  [verifyUser, rateLimiter(5), validateHmac],
  userController.userUpdateProfile
);
userRoute.put(
  "/changepassword",
  [verifyUser, rateLimiter(2), validateHmac],
  userController.changeUserPassword
);
userRoute.delete(
  "/archive",
  [verifyUser, rateLimiter(1)],
  userController.archiveUser
);
userRoute.get(
  "/getUserId",
  [verifyUser, rateLimiter(25)],
  userController.getUserId
);
userRoute.get(
  "/currentuser",
  [verifyUser, rateLimiter(25)],
  userController.currentUser
);
userRoute.put(
  "/checkpassword",
  [verifyUser, rateLimiter(5), validateHmac],
  userController.checkPassword
);
userRoute.get(
  "/getauser/:user_id",
  [verifyUser, rateLimiter(15)],
  userController.getAUser
);

module.exports = userRoute;
