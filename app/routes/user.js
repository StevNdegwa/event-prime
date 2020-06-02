//event-prime\app\routes\user.js
const express = require("express");
const User = require("../controllers/user.js");
const UserValidation = require("../middleware/uservalidation.js");

const app = express.Router();

app.get("/", (request, response)=>{
  response.send("User Login");
})
app.get("/home/:user", (request, response)=>{
  const {user} = request.params;
  return response.json({message:"Welcome Home "+user});
})
app.put("/signup", UserValidation.newUser, User.signUp);
app.post("/signin", UserValidation.currentUser, User.signIn);

module.exports = app;