//event-prime\app\index.js
const express = require("express");
const logger = require("morgan");
const bp = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const user = require("./routes/user.js");
const events = require("./routes/events.js");

const app = express();

app.use(logger("combined"));
app.use(bp.urlencoded({extended:true}));
app.use(bp.json());

app.use((request, response, next)=>{
  response.set("Access-Control-Allow-Origin", "*");
  next();
})

app.use(session({resave:true, saveUninitialized:true, secret:"event-prime"}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("./public"));
app.use("/user", user);
app.use("/events", events);

app.use((request, response)=>{
  return response.status(404).json({message:"Page Not Found."});
})

app.use((error, request, response, next)=>{
  console.log(error) //Set up an error logger
  return response.status(500).json({message:"Currently Unavailable"});
})

module.exports = app;