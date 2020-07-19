class UserAuthorization{
  
  static createEvent(request, response, next){
    const {user} = request;
    
    if(!!user){
      
      switch(user.role){
        case "SUPERADMIN":
        case "ADMIN":
          return next();
        default:
          return response.json({message:"Authorization failed"});
      }
      
    }else{
      //Redirect to homepage
      return response.redirect("/user");
    }
  }
  static readUserEvents(request, response, next){
    const {user} = request;
    
    if(!!user){
      
      switch(user.role){
        case "SUPERADMIN":
        case "ADMIN":
        case "CLIENT":
          return next();
        default:
          return response.json({message:"Authorization failed"});
      }
      
    }else{
      //Redirect to homepage
      return response.redirect("/user");
    }
  }
}

module.exports = UserAuthorization;