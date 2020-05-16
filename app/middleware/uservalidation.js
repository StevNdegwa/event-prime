//event-prime\app\middleware\uservalidation.js
const Joi = require("joi");
const User = require("../controllers/user");

class UserValidation{
  static async newUser(request, response, next){
    try{
      const {user} = request.body;
  
      if(user){
      
        if(user.email !== user.confirmEmail){
        
          return response.json({added:false, message:"Emails do not match."});
        
        }
      
        if(user.password !== user.confirmPassword){
        
          return response.json({added:false, message:"Passwordd do not match."});
        
        }
      
        const userSchema = Joi.object().keys({
          email:Joi.string().email(),
          confirmEmail:Joi.string().strip(),
          fname:Joi.string().replace("'", "&#39;"),
          lname:Joi.string().replace("'", "&#39;"),
          password:Joi.string().regex(/^[-a-zA-Z0-9@]{8,15}$/),
          confirmPassword:Joi.string().strip()
        }).with("email", ["password", "fname", "lname"]);
    
        const result = await Joi.validate({...user}, userSchema);
    
        if(result.error){
        
          return response.json({added:"false", message:"Validation Failed!!"})
        
        }else{
        
          const exists = await User.findUserByEmail(user.email); 
        
          if(!exists){
          
            request.body = result;
          
            return next();
          
          }else{
          
           return response.json({added:false, message:"User Exists"})
          
          }
        }
      }else{
      
        return next(new Error("Invalid Request"));
      
      }
    }catch(error){
    
      return next(error);
      
    }
  }
  //Function to sign in
  static async currentUser(request, response, next){
    const {email, password} = request.body;
  
    if(email && password){
    
      try{
      
        const userSchema = Joi.object().keys({
          email:Joi.string().email(),
          password:Joi.string().regex(/^[-a-zA-Z0-9@]{8,15}$/)
        }).with("email", "password")
      
        const result = await Joi.validate({email, password}, userSchema);
      
        if(result.error){
        
          return response.json({message:"Please chek your credentials."});
        
        }else{
        
          return next();
        
        }
      
      }catch(error){
      
        return next(error);
      
      } 
    }
  }
}

module.exports = UserValidation;