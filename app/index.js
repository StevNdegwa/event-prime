const express = require("express");
const logger = require("morgan");
const bp = require("body-parser");
const user = require("./routes/user.js");

const app = express();

app.use(logger("combined"));
app.use(bp.urlencoded({extended:true}));
app.use(bp.json());

app.use(express.static("./public"));
app.use("/user", user);

app.use((error, request, response, next)=>{
  console.log(error) //Set up an error logger
  return response.json({message:"Currently Unavailable"});
})

module.exports = app;