//./app/controllers/tickets.js
const Async = require("async");
const db = require("../models/database");

class Tickets{
  static async addNewTickets(request, response, next){
    try{
      const tickets = request.body,
          {eventid} = request.params;
      
      const result = await db.query(`INSERT INTO _event.tickets (name, eventid, type, quantity, price) VALUES ('${tickets.name}','${eventid}','${tickets.provided[0].type}','${tickets.provided[0].quantity}','${tickets.provided[0].price}'), ('${tickets.name}','${eventid}','${tickets.provided[1].type}','${tickets.provided[1].quantity}','${tickets.provided[1].price}')`);
      
      if(!!result.rowsAffected[0]){
        
        return response.json({created:true, message:"Tickets created successfully"});
        
      }else{
        
        return response.json({created:false, message:"Tickets not created"});
      }
      
    }catch(error){
      return next(error);
    }
  }
}

module.exports = Tickets;