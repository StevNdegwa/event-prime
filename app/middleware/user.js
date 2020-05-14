//event-prime\app\middleware\eventcreator.js
const User = require("../controllers/user.js");
const Joi = require("joi");

async function signUp(request, response, next){
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
        basic:{
          title:Joi.string().regex(/^[a-zA-Z0-9@\s]/),
          type:Joi.number().min(1),
          category:Joi.number().min(1)
        },
        location:{
          online:Joi.number().min(0).max(1),
          name:Joi.string().alphanum()
        },
        dates:{
          start:Joi.date().min('now'),
          end:Joi.date().min('now'),
          frequency:Joi.number().min(1)
        }
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