const userRoute = require("express").Router();
const userController = require("../controllers/userController");
const verifyUser = require("../middleware/verifyUser");
const { rateLimiter } = require("../middleware/rate-limit");
const { validateHmac } = require("../middleware/hmac-validator");
const { enableUserAgentTracking } = require("../middleware/user-agent");

// user update profile
userRoute.put(
  "/update",
  [verifyUser, rateLimiter(5), validateHmac, enableUserAgentTracking],
  userController.userUpdateProfile
);
userRoute.put(
  "/changepassword",
  [verifyUser, rateLimiter(2), validateHmac, enableUserAgentTracking],
  userController.changeUserPassword
);
userRoute.delete(
  "/archive",
  [verifyUser, rateLimiter(1), enableUserAgentTracking],
  userController.archiveUser
);
userRoute.get(
  "/getUserId",
  [verifyUser, rateLimiter(25), enableUserAgentTracking],
  userController.getUserId
);
userRoute.get(
  "/currentuser",
  [verifyUser, rateLimiter(25), enableUserAgentTracking],
  userController.currentUser
);
userRoute.put(
  "/checkpassword",
  [verifyUser, rateLimiter(5), validateHmac, enableUserAgentTracking],
  userController.checkPassword
);
userRoute.get(
  "/getauser/:user_id",
  [verifyUser, rateLimiter(15), enableUserAgentTracking],
  userController.getAUser
);

userRoute.delete(
  "/deletedata",
  [verifyUser, rateLimiter(1), enableUserAgentTracking],
  userController.deleteAllUserData
);

module.exports = userRoute;
