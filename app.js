const express = require('express');

let app = express();

var session = require('express-session')


//importing cookie parser
const cookieParser = require('cookie-parser')

const registerRoute = require('./routes/registerRoute');

const loginRoute = require('./routes/loginRoute');

const quoteRoute = require("./routes/quoteRoute")

const userRoute = require("./routes/userRoute");

const commentRoute = require('./routes/commentRoute');

const likeRoute = require('./routes/likeRoute');

const followerRoute = require('./routes/followerRoute');

const path = require("path");


//importing cors
const cors = require('cors');


const dotenv = require('dotenv');
// const emailRoute = require('./routes/emailRoute');

dotenv.config();

require("./models/connections")


// middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: process.env.SESSIONSECRET||"sdfjsdjfj",
  resave: false,
  saveUninitialized: true,
}))


// routes
app.use("/register", registerRoute);
app.use("/userlogin", loginRoute);
app.use("/quote", quoteRoute);
app.use("/user", userRoute);
app.use("/comment", commentRoute);
app.use("/like", likeRoute);
app.use("/follow", followerRoute);
app.use("/sendemail", emailRoute);


// app.post("/verifytoken", async(req, res)=>{

//     let {token} = req.body;

//     try {

//         if(token !== req.session.token){
//             return res.status(401).json({"message": "Invalid Token"});
//         }
//         res.status(200).json({"message": "Token Verified"});

        
//     } catch (error) {
//         console.log(error);
//     }

// })

//initial path
app.get('/', function (req, res) {
    res.json({"message":"this is initial route of blogging api"})
  });

module.exports=app;