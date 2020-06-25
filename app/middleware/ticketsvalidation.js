//./app/middleware/ticketsvalidation.js
const Joi = require("joi");

class TicketsValidation{
  static async newTickets(request, response, next){
    const {tickets} = request.body;
    if(!!tickets){
      try{
        const ticketsSchema = Joi.object().keys({
          name:Joi.string().min(3).max(50),
          provided:Joi.array().items(Joi.object().keys({
            type:Joi.string().valid(["FREE","PAID"]),
            quantity:Joi.number().integer().positive(),
            price:Joi.number().min(0)
          }))
        })
      
        const result = await Joi.validate(tickets, ticketsSchema); 
        request.body = result;
        return next();
      }catch(error){
        console.log(error);
        return response.json({created:false, message:"Invalid Details"});
      }
    }else{
      return next(new Error("Invalid Request"));
    }
  }
}

module.exports = TicketsValidation;