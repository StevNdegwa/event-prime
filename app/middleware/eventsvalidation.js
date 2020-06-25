const Joi = require("joi");

class EventsValidation{
  static async newEvent(request, response, next){
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
    
        request.body = result;
        
        return next();
  
      }catch(error){
      
        return response.json({created:false, message:"Event not created. Invalid details"});
      
      }
    }else{
    
      return next(new Error("Invalid Request"));
    
    }
  }
}

module.exports = EventsValidation;