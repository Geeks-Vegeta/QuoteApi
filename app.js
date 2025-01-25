//importing express
const express = require("express");
require("express-async-errors");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const logger = require("./utils/logger");
const cors = require("cors");
const moment = require("moment");
const helmet = require("helmet");
const mongoClient = require("./configs/mongo_connection");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const session = require("express-session");
const errorHandler = require("./responses/error-handler");
const dotenv = require("dotenv");
dotenv.config();

const registerRoute = require("./routes/registerRoute");
const loginRoute = require("./routes/loginRoute");
const quoteRoute = require("./routes/quoteRoute");
const userRoute = require("./routes/userRoute");
const commentRoute = require("./routes/commentRoute");
const likeRoute = require("./routes/likeRoute");
const followerRoute = require("./routes/followerRoute");
const todayquote = require("./models/todayModel");
const scrapQuote = require("./models/ScrapQuoteModel");
const { validateHmac } = require("./middleware/hmac-validator");
const { rateLimiter } = require("./middleware/rate-limit");
const cron = require("node-cron");

//configurations
mongoClient.connect();

// middleware
morgan.token("time", (req) => {
  return moment().toLocaleString();
});
app.use(
  session({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(":time | :method :url :status :response-time ms"));
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// routes
app.use("/register", [validateHmac, rateLimiter(5)], registerRoute);
app.use("/login", [validateHmac, rateLimiter(5)], loginRoute);
app.use("/quote", quoteRoute);
app.use("/user", userRoute);
app.use("/comment", commentRoute);
app.use("/like", likeRoute);
app.use("/follow", followerRoute);

const getRandomQuote = async () => {
  const numItems = await scrapQuote.estimatedDocumentCount();
  const rand = Math.floor(Math.random() * numItems);
  const randomItem = await scrapQuote.findOne().skip(rand);
  await todayquote.deleteMany({});
  await todayquote.insertMany([randomItem]);
};

// 0 0 0 * * * at mid night 12 am
cron.schedule("0 0 12 * *", () => {
  getRandomQuote();
  console.log("quote changed");
});

app.get("/quoteofday", async (req, res) => {
  try {
    const getRes = await todayquote.findOne({ today: true });
    return res.send(getRes);
  } catch (error) {
    console.log(error);
  }
});

//initial path
app.get("/ping", async (req, res) => {
  res.send({ message: "pong" });
});

app.use(errorHandler);
app.use((err, req, res, next) => {
  // Send a JSON response with the error message and status code
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    data: {
      item: {},
    },
    status: {
      type: "error",
      message: "Something went wrong. Please try again later.",
      description: "Something went wrong",
    },
  });
});

function handleProcessExceptions() {
  process.on("uncaughtException", (ex) => {
    logger.exception(ex);
  });
  process.on("unhandledRejection", (ex) => {
    logger.exception(ex);
  });
}
handleProcessExceptions();

module.exports = app;
