//event-prime\app\controllers\user.js
const {v4: uuidv4} = require("uuid");
const db = require("../models/database");
const EmailService = require("../helpers/emailservice");

class User{
  static async findUserByEmail(email, callback){ //Utility function to find if user exists
    try{
      const [user] = await db.table("_user.users").find().where("email", email);
      if(callback){
        return callback(null, user);
      }
      return user;
    }catch(error){
      throw error;
    }
  }
  
  static async signUp(request, response, next){
   try{
    const {user} = request.body;
    const token = uuidv4();
    const result = await db.table("_user.validation_tokens").add(["email", "token"], [`'${user.email}'`, `'${token}'`]);
    
    if(!!result){
      const sender = {
        email:"investarco.ke@yahoo.com",
        name:"Event Prime",
        password:"nkhhkwdunzxfldtz"
      },
      message = {
        subject: "Account Creation Link",
        body:`Follow this link to create your account: http://localhost:7000/user/create-account/${token}`
      },
      emailsTo = [user.email];
      
      const send = await EmailService.sendEmail(sender, message, emailsTo);
      
      return response.json({added:true, 
        message:"Signup successfull. We sent an email with an activation link.", 
        link:`http://localhost:7000/user/create-account/${token}`
      });
    }else{
      return response.json({added:false, message:"Signup failed"});
    }
   }catch(error){
     
     return next(error);
     
   }
  }
  
  static async validateSignupToken(token, email){
    const [result] = await db.table("_user.validation_tokens").find().where("token", token);
    
    if(!!result){
      if(result.email === email){
        return true;
      }
    }
    return false;
  }
  
  static async createAccount(request, response, next){
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