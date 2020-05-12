//event-prime\app\middleware\eventcreator.js
const User = require("../controllers/user.js");

async function signUp(request, response, next){
  
  const {user} = request.body;
  
  if(user){
    try{
    
      const added = await User.signUp({email:user.e, name:user.n, password:user.pw})
   
     
      return response.json(added);
    }catch(error){
    
      next(error);
    
    }
  }else{
    
    next(new Error("Invalid request"));
    
  }
}

//Function to sign in
async function signIn(request, response, next){
  const passport = require("passport"),
      LocalStrategy = require("passport-local").Strategy;
      
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
     User.signIn({email}, function(error, user){
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
 
        //return response.redirect("/home")
        return response.json({message:"A user was found"})
      })
    })(request, response, next)
  }catch(error){
    
    return next(error);
    
  }
}

async function createEvent(request, response, next){
  const {newEvent} = request.body;
  
  if(newEvent){
    try{
      
      const created = await User.createNewEvent(request.user, newEvent);
      
      return response.json(created);
      
    }catch(error){
      
      return next(error);
      
    }
  }else{
    
    return next(new Error("Invalid Request"));
    
  }
}

module.exports = {signUp, signIn, createEvent};