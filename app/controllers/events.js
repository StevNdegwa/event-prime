//event-prime\app\controllers\events.js
const db = require("../models/database");

class Events{
  static async addNewEvent(request, response, next){
    try{
      
      const newEvent = request.body;
    
      const result = await db.events.add(request.user, newEvent)
      
      if(!!result){
        
        return response.json({created:true, message:"Event Successfully created"});
        
      }else{
        
        return response.json({created:false, message:"Event not created."});
      }
      
    }catch(error){
      
      return next(error);
      
    }
  }
}

module.exports = Events;