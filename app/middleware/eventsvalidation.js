const Joi = require("joi");

class EventsValidation{
  static async newEvent(request, response, next){
    try{
      const {newEvent} = request.body;
      
      const eventSchema = Joi.object().keys({
        basic:{
          title: Joi.string().regex(/^[a-zA-Z0-9@\s]/).required(),
          type: Joi.number().min(1).required(),
          category: Joi.number().min(1).required()
        },
        location:{
          online:Joi.number().min(0).max(1).required(),
          name:Joi.string().alphanum().required()
        },
        dates:{
          start:Joi.date().min('now').required(),
          end:Joi.date().min('now').required(),
          frequency:Joi.number().min(1).required()
        }
      })
     
      try{
        const result = await Joi.validate(newEvent, eventSchema);
        
        request.body = result;
        return next();
        
      }catch(error){
        return response.json({created:false, message:"Invalid event details"});
      }
    }catch(error){
      
      return next(error);
    }
  }
}

module.exports = EventsValidation;