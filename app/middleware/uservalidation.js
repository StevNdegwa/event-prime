//event-prime\app\middleware\uservalidation.js
const Joi = require("joi");
const User = require("../controllers/user");

class UserValidation{
  static async newUserSignup(request, response, next){
    try{
      const {user} = request.body;
      try{
        
        var email = await Joi.validate(user.email, Joi.string().email());

      }catch(error){
        
        return response.json({added:false, message:"Please use a valid email"});
      }
        
      const exists = await User.findUserByEmail(email);
      
      if(exists){
        
        return response.json({added:false, message:"A user by that email already exists"});
        
      }else{
        
        return next();
        
      }
    }catch(error){
    
      return next(error);
      
    }
  }
  
  static async newUserCreateAccount(request, response, next){
    try{
      const {user} = request.body, {token} = request.params;
      
      if(user.password !== user.confirmPassword){
        return response.json({created:false, message:"Passwords not identical."});
      }
      
      const valid = await User.authenticateSignupToken(token, user.email);
      
      if(!valid){
        return response.json({created:false, message:"Invalid signup token"});
      }
      
      try{//Other data validation
        const userSchema = Joi.object().keys({
          email: Joi.string().email(),
          fname: Joi.string().replace("'", "&#39;"),
          lname: Joi.string().replace("'", "&#39;"),
          password: Joi.string().regex(/^[-a-zA-Z0-9@]{8,15}$/),
          role: Joi.string().valid("SUPERADMIN", "ADMIN", "CLIENT")
        }).with("email", ["fname","lname","password","role"])
        
        const {fname, lname, password, role, email} = user;
          
        const validatedUser = await Joi.validate({fname, lname, password, role, email}, userSchema);
          
        request.body = validatedUser;
          
        return next();
      }catch(error){
        return response.json({added:false, message:"Invalid Details."});
      }//Other data validation
    }catch(error){
      return next(error);
    }
  }
  
  //Function to sign in
  static async currentUser(request, response, next){
    try{
      const {email, password} = request.body;
      
      const userSchema = Joi.object().keys({
        email:Joi.string().email(),
        password:Joi.string().regex(/^[-a-zA-Z0-9@]{8,15}$/)
      }).with("email", "password")
      
      const result = await Joi.validate({email, password}, userSchema);
      
      return next();
      
    }catch(error){
      
      return response.json({message:"Incorrect Login details"});
      
    }
  }
}

module.exports = UserValidation;