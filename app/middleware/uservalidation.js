//event-prime\app\middleware\uservalidation.js
const Joi = require("joi");
const User = require("../controllers/user");

class UserValidation{
  static async newUser(request, response, next){
    try{
      const {user} = request.body;
  
      if(user){
        
        if(user.password !== user.confirmPassword){ //Password Validation
        
          return response.json({added:false, message:"Passwordd do not match."});
        
        }//Password Validation
        
        if(user.email !== user.confirmEmail){ //Email Validation
        
          return response.json({added:false, message:"Emails do not match."});
        
        }else{
          
          try{
            
            var email = await Joi.validate(user.email, Joi.string().email());
          
            if(email){
            
              const exists = await User.findUserByEmail(email); 
            
              if(!!exists){
          
                return response.json({added:false, message:"User Exists"})
          
              }
            }
            
          }catch(error){
            
            return response.json({added:false, message:"Invalid Email"})
            
          }
        }//Email Validation
      
        try{//Other data validation
          const userSchema = Joi.object().keys({
            fname: Joi.string().replace("'", "&#39;"),
            lname: Joi.string().replace("'", "&#39;"),
            password: Joi.string().regex(/^[-a-zA-Z0-9@]{8,15}$/)
          }).with("email", ["password", "fname", "lname"]);
        
          const {fname,lname,password} = user;
        
          const u = await Joi.validate({fname, lname, password}, userSchema);
    
          if(!u.error){
          
            request.body = {...u, email:user.email};
          
          return next();
          }
        }catch(error){
          
          return response.json({added:false, message:"Invalid Details."})
          
        }//Other data validation
        
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