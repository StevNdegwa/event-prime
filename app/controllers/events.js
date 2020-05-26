//event-prime\app\controllers\events.js
const db = require("../models/database");

class Events{
  static async addNewEvent(request, response, next){
    try{
      
      const newEvent = request.body;
      const {basic, location, dates} = newEvent;
      
      const result = await db.table("_event.events").add(["creatorid","title","event_type","event_category","online_event","event_location","event_start_date","event_end_date","frequency"], [`'${request.user}'`,`'${basic.title}'`,`'${basic.type}'`,`'${basic.category}'`,`'${location.online}'`,`'${location.name}'`, `'${dates.start.toLocaleDateString()}'`,`'${dates.end.toLocaleDateString()}'`,`'${dates.frequency}'`]);
      
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