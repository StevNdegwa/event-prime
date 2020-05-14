const express = require("express");
const logger = require("morgan");
const bp = require("body-parser");
const user = require("./routes/user.js");

const app = express();

app.use(logger("combined"));
app.use(bp.urlencoded({extended:true}));
app.use(bp.json());

app.use((request, response, next)=>{
  response.set("Access-Control-Allow-Origin", "*");
  next();
})


app.use(express.static("./public"));
app.use("/user", user);

app.get("/home/:user", (request, response)=>{
  const {user} = request.params;
  return response.json({message:"Welcome Home "+user});
})

app.use((request, response)=>{
  return response.status(404).json({message:"Page Not Found."});
})

app.use((error, request, response, next)=>{
  console.log(error) //Set up an error logger
  return response.status(500).json({message:"Currently Unavailable"});
})

module.exports = app;