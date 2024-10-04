const express = require("express");
require("express-async-errors");

let app = express();

//importing cookie parser
const cookieParser = require("cookie-parser");
const errorHandler = require("./utils/exceptions/error_handler");

const authRoute = require("./routes/authRoute");
const quoteRoute = require("./routes/quoteRoute");
const userRoute = require("./routes/userRoute");
const commentRoute = require("./routes/commentRoute");
const likeRoute = require("./routes/likeRoute");
const followerRoute = require("./routes/followerRoute");
const todayquote = require("./models/todayModel");
const scrapQuote = require("./models/ScrapQuoteModel");
const cron = require("node-cron");
const { rateLimiter } = require("./middleware/ratelimit");

//importing cors
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();
require("./models/connections").connect();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// routes
app.use("/api/auth", authRoute);
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

app.use(errorHandler);
app.use((err, req, res, next) => {
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

//initial path
app.get("/", function (req, res) {
  res.json({ message: "this is initial route of blogging api" });
});

const handleNotFound = rateLimiter(5, 60 * 1000); // Limit to 5 requests per minute

app.use(
  (req, res, next) => {
    res.status(404);
    next();
  },
  handleNotFound,
  (req, res) => {
    res.json({
      data: {
        item: {},
      },
      status: {
        type: "error",
        message: "This route does not exist.",
        description: "Something went wrong",
      },
    });
  }
);

module.exports = app;
