//event-prime\app\middleware\eventcreator.js
const User = require("../controllers/user.js");
const Joi = require("joi");

async function signUp(request, response, next){
  try{
    const {user} = request.body;
  
    if(user){
      
      const userSchema = Joi.object().keys({
        email:Joi.string().email(),
        fname:Joi.string().replace("'", "&#39;"),
        lname:Joi.string().replace("'", "&#39;"),
        password:Joi.string().regex(/^[-a-zA-Z0-9@]{8,15}$/)
      }).with("email", "password").with("fname", "lname")
    
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
async function signIn(request, response, next){
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

async function createEvent(request, response, next){
  const {newEvent} = request.body;
  
  if(newEvent){
    try{
      
      const eventSchema = Joi.object().keys({
        name:Joi.string().regex(/^[a-zA-Z0-9@\s]/)
      })
    
      const result = await Joi.validate({...newEvent}, eventSchema);
    
      if(result.error){
      
        return response.json({created:false, message:"Event not created"});
      
      }else{
      
        request.body = result;
      
        return next();
      
     }
  
    }catch(error){
      
      return next(error);
      
    }
  }else{
    
    return next(new Error("Invalid Request"));
    
  }
}

module.exports = {signUp, signIn, createEvent};