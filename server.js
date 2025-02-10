const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  // Ensure server only listens in non-test environments
  app.listen(port, () => {
    console.log(`connected to port ${port}`);
  });
}

module.exports = app;
