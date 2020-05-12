//event-prime\app\controllers\eventcreator.js
const db = require("../models/database");

class User{
  static userExists(email){ //Utility function to find if user exists
    return db.query(`SELECT * FROM _user.e_creator WHERE email = '${email}'`)
    .then((result)=>{
      if(result.rowsAffected[0] > 0){ //If user exists
        
        return result.recordset[0];
      }
      return false;
    }).catch((error)=>{
      
      throw error;
      
    })
    
  }
  
  static async signUp(user){
   //var exists = await this.userExists(user.email); //Find if user exists
   
   return this.userExists(user.email)
   .then((exists)=>{
     if(!exists){
       return db.query(`INSERT INTO _user.e_creator (email, name, password) VALUES('${user.email}', '${user.name}', '${user.password}')`)
        .then((result)=>{
       
          if(result.rowsAffected[0] > 0){
         
            return {added:true,message:"Signup successfull"}
          }else{
        
            return {added:false, message:"Signup failed"}
          }
        })
     }else{
       
       return {added:false,message:"User alread exists"}
     }
   })
  }
  
  static async signIn(user, callback){
    return this.userExists(user.email)
    .then((exists)=>{
      if(!!exists){
        
        const {email, password, name, id} = exists;
        return callback(null, {email, password, name, id});
        
      }else{
        
        return callback();
        
      }
    }).catch((error)=>{
      
      throw error;
      
    })
  }
  
  static async createNewEvent(userId, newEvent){
    return db.query(`INSERT INTO _event.events (creatorid, name) VALUES(${userId}, '${newEvent.name}')`)
    .then((result)=>{
      
      if(result.rowsAffected[0] > 0){
        
        return {created:true, message:"Event Successfully created"};
      }else{
        
        return {created:false, message:"Event not created."};
      }
    }).catch((error)=>{
      
      throw error;
    })
  }
}

module.exports = User;