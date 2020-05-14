//event-prime\app\controllers\eventcreator.js
const db = require("../models/database");

class User{
  static async findUserByEmail(email, callback){ //Utility function to find if user exists
  
    try{
      
      const user = await db.users.find().where(email);
      
      if(callback){
       
        return callback(null, user)
       
      }
      
      return user;
      
    }catch(error){
      
      throw error;
      
    }
  }
  
  static async addUser(request, response, next){
   try{
     
    const user = request.body;
     
    const result = await db.users.add(user);
    
    if(result > 0){
        
      return response.json({added:true, message:"Signup successfull"});
        
    }else{
        
      return response.json({added:false, message:"Signup failed"});
        
    }
     
   }catch(error){
     
     return next(error);
     
   }
    

  }
  
  static async logIn(request, response, next){
    const passport = require("passport"), LocalStrategy = require("passport-local").Strategy;
      
    passport.serializeUser(function(user, done){
     
      done(null, user.id)
    })
   
    passport.deserializeUser(function(id, done){
     
      done(null, id);
    })
   
    passport.use(new LocalStrategy({
        usernameField:"email",
        passwordField:"password"
      },
      function(email, password, done){
        User.findUserByEmail(email, function(error, user){
          if(error){
            return done(error);
          }
          if(!user){
            return done(null, false, {message:"Please check your email"})
          }
          if(user.password !== password){
            return done(null, false, {message:"Wrong Password."})
          }
          return done(null, user);
        })
      }
    ))
    
    
    try{
      
      passport.authenticate("local", function(error, user, info){
        if(error){
      
          return next(error);
        }
        if(!user){
      
          //return response.redirect("/signin")
          return response.json(info)
        }
        request.logIn(user, (error)=>{
      
          if(error){
        
            return next(error);
          }
 
          return response.redirect("/home/"+user.email)
        })
      
      })(request, response, next)
      
    }catch(error){
      
      return next(error);
      
    }
    
  }
  
  static async addNewEvent(request, response, next){
    try{
      
      const newEvent = request.body;
    
      const result = await db.events.add(request.user, newEvent)
      
      if(result > 0){
        
        return response.json({created:true, message:"Event Successfully created"});
        
      }else{
        
        return response.json({created:false, message:"Event not created."});
      }
      
    }catch(error){
      
      return next(error);
      
    }
  }
}

module.exports = User;