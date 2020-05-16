//event-prime\app\routes\user.js
const express = require("express");
const passport = require("passport");
const session = require("express-session");

const User = require("../controllers/user.js");
const Events = require("../controllers/events.js");
const UserValidation = require("../middleware/uservalidation.js");
const EventsValidation = require("../middleware/eventsvalidation.js");

const app = express.Router();

app.use(session({resave:true, saveUninitialized:true, secret:"event-prime"}))
app.use(passport.initialize());
app.use(passport.session());

app.put("/signup", UserValidation.newUser, User.signUp);
app.post("/signin", UserValidation.currentUser, User.signIn);
app.put("/createevent", EventsValidation.newEvent, Events.addNewEvent);

app.put("/welcome", (request, response)=>{
  
  response.json({message:"Welcome New User"})
})

module.exports = app;