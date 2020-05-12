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