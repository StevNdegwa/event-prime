//event-prime\app\controllers\user.js
const {v4: uuidv4} = require("uuid");
const bcrypt = require("bcrypt");
const asyncc = require("async");
const passport = require("passport");
const {Strategy:LocalStrategy} = require("passport-local");
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
  
  static async authenticateSignupToken(token, email){
    const [result] = await db.table("_user.validation_tokens").find().where("token", token);
    
    if(!!result){
      if(result.email === email){
        return true;
      }
    }
    return false;
  }
  
  static async validateSignupToken(request, response, next){
    try{
      const [result] = await db.table("_user.validation_tokens").find().where("token", token);
    
      if(!!result){
        return response.json({valid:true, message:"Token is valid"});
      }
      return response.json({valid:false, message:"Token is invalid"});
    }catch(error){
      return next(error)
    }
  }
  
  static async createAccount(request, response, next){
   try{
    const user = request.body;
    let {password, email, fname, lname, role} = user;
    
    return asyncc.waterfall([
      function(callback){
        bcrypt.hash(password, 10, function(error, hash){
          callback(error, hash);
        })
      },
      function(hashedPassword, callback){
        return db.table("_user.users").add(["email", "name", "password", "role"], [`'${email}'`,`'${fname+" "+ lname}'`, `'${hashedPassword}'`, `'${role}'`])
        .then((result)=>{
          callback(null, result);
        })
      }
    ],
    function(err, result){
      if(!!result){
        return response.json({added:true, message:"Signup successfull"});
      }else{
        return response.json({added:false, message:"Signup failed. Try again later"});
      }
    });
   }catch(error){
     return next(error);
   }
  }
  
  static async signIn(request, response, next){
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
          return bcrypt.compare(password, user.password, function(error, result){
            if(result){
              return done(null, user);
            }else{
              return done(null, false, {message:"Wrong Password."});
            }
          });
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