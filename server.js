const http = require("http");
const server = http.createServer();

const app = require("./app");

server.on("request", app)
      .on("listening", function(){
        
        console.log("Listening on port " + this.address().port)
        
      })
      .on("error", function(error){
        
        console.log(error.code);
        
      })
      .listen(7000);