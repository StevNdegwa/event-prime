//event-prime\app\routes\eventcreator.js
const express = require("express");
const passport = require("passport");
const session = require("express-session");

const User = require("../controllers/user.js");
const {signUp, signIn, createEvent} = require("../middleware/user.js");

const app = express.Router();

app.use(session({resave:true, saveUninitialized:true, secret:"event-prime"}))
app.use(passport.initialize());
app.use(passport.session());

app.put("/signup", signUp, User.addUser);
app.post("/signin", signIn, User.logIn);
app.put("/createevent", createEvent, User.addNewEvent);

app.put("/welcome", (request, response)=>{
  
  response.json({message:"Welcome New User"})
})

module.exports = app;