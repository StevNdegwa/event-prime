//event-prime\app\controllers\user.js
const db = require("../models/database");

class User{
  static async findUserByEmail(email, callback){ //Utility function to find if user exists
  
    try{
      
      const users = await db.table("_user.users").find().where("email", email);
      
      if(callback){
       
        return callback(null, users[0])
       
      }
      
      return users[0];
      
    }catch(error){
      
      throw error;
      
    }
  }
  
  static async signUp(request, response, next){
   try{
     
    const user = request.body;
     
    const result = await db.table("_user.users").add(["email", "name", "password", "role"], [`'${user.email}'`,`'${user.fname+" "+ user.lname}'`, `'${user.password}'`, `'${user.role}'`]);
    
    if(!!result){
        
      return response.json({added:true, message:"Signup successfull"});
        
    }else{
        
      return response.json({added:false, message:"Signup failed"});
        
    }
     
   }catch(error){
     
     return next(error);
     
   }
  }
  
  static async signIn(request, response, next){
    const passport = require("passport"), LocalStrategy = require("passport-local").Strategy;
      
    passport.serializeUser(function(user, done){
     
      done(null, {id:user.id, role:user.role})
    })
   
    passport.deserializeUser(function(user, done){
     
      done(null, user);
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
      
          return response.json(info)
        }
        request.logIn(user, (error)=>{
      
          if(error){
        
            return next(error);
          }
 
          return response.redirect("/user/home/"+user.email)
        })
      
      })(request, response, next)
      
    }catch(error){
      
      return next(error);
      
    }
    
  }
}

module.exports = User;