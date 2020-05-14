const mssql = require("mssql");

const config = {
  server:'LOCALHOST\\SQLEXPRESS',
  user:'sa',
  password:'STEPHEN@2019',
  database:'EVENTPRIME',
  encrypt:false,
  options:{
    enableArithAbort:false
  }
}

class Database{
   static users = {
     find:()=>{
       return {
         where:async (email)=>{
           var result = await Database.query(`SELECT * FROM _user.e_creator WHERE email = '${email}'`);
           return result.recordset[0];
         }
       }
     },
     add:async (user)=>{
       var result = await Database.query(`INSERT INTO _user.e_creator (email, name, password) VALUES('${user.email}','${user.fname+" "+ user.lname}', '${user.password}')`);
       return result.rowsAffected[0];
     }
   }
   
   static events = {
     find:()=>{
       return {
         where:async (email)=>{
           var result = await Database.query(`SELECT * FROM _event.events WHERE id = '${id}'`);
           
           return result.recordset[0];
         }
       }
     },
     add:async (user_id, newEvent)=>{
       const {basic, location, dates} = newEvent;
       
       var result = await Database.query(`INSERT INTO _event.events (creatorid, title, event_type, event_category, online_event, event_location, event_start_date, event_end_date, frequency) VALUES ('${user_id}', '${basic.title}', '${basic.type}', '${basic.category}', '${location.online}', '${location.name}', '${dates.start.toLocaleDateString()}', '${dates.end.toLocaleDateString()}', '${dates.frequency}')`);
       
       return result.rowsAffected[0];
     }
   }
   
  static query(query){
    
    return mssql.connect(config).then((conn)=>{
      
      return conn.request().query(query)
      
    })
  }
  
  static async transaction(queries){
    const pool = await mssql.connect(config);
    
    const transac = new mssql.Transaction(pool);
    
    await transac.begin(async (error)=>{
      
      let request = new mssql.Request(transac);
      
      let failed = await queries(request);
      
      if(failed){
        
        transac.rollback((error)=>{
          
          console.log("Transaction rolled back");
          
        });
        
      }else{
        
        transac.commit((error)=>{
          
          console.log("Transaction was successfully committed")
        
        })
      }
    })
  }
}

module.exports = Database;