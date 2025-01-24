const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const auth = req.headers["authorization"].split(" ")[1];
  if (!auth) return res.status(401).json({ message: "Invalid Token" });

  try {
    const verify = jwt.verify(auth, process.env.TOKEN_SECRET);
    req.user = verify;
    next();
  } catch (error) {
    res.send(error);
  }
};

module.exports = verifyUser;
