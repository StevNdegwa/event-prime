const Joi = require("joi");

class TicketsValidation{
  static newTickets(request, response, next){
    try{
      const {tickets} = request.body;
      
      const ticketsSchema = Joi.object.keys({
        name:Joi.string().min(3).max(50),
        forevent:Joi.number(),
        provided:Joi.array().items(Joi.object.keys({
            type:Joi.string().valid(["FREE","PAID"]),
            quantity:Joi.number().integer().positive(),
            price:Joi.number().positive()
          }))
      })
      
      const result = Joi.validate(tickets, ticketsSchema);
      
      request.body = result;
      
      return next();
      
    }catch(error){
      return response.json({added:false, message:"Invalid Details"});
    }
  }
}