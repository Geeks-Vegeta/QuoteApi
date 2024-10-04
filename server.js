const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`connected to port ${port}`);
});

module.exports = app;
