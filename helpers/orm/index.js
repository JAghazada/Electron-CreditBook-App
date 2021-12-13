
var sqlite3 = require('sqlite3').verbose()
const openDb = ()=>{
    var db = new sqlite3.Database('./CreditBank',(err)=>{
        if(err){
            return err
        }
    })
      return db
}

 function   insertData (table_name,datas){
    var db = openDb()

    var query = ''
    var query2 = ''
    datas.map(value=>{
        stdt = value.split(':')
        if(stdt[1] === datas[datas.length-1].split(':')[1]){
           query+=stdt[0]
           query2+=`'${stdt[1]}'`

        }else{
            query+=stdt[0]+','
            query2+=`'${stdt[1]}'`+','
        }
        
   })
   
    db.all(`INSERT INTO ${table_name} (${query}) VALUES (${query2})`)
    closeDb(db)

};

function createTable(table_name,values){
    var db = openDb()
    var query = ''
    values.map(value=>{
         if(value === values[values.length-1]){
            query+=value.split(':').join(' ')

         }else{
         query+=value.split(':').join(' ')+','
         }
         
    })
    db.get(`CREATE TABLE IF NOT EXISTS ${table_name}(${query})`)
    closeDb(db)
}
function deleteTable(table_name){
    var db = openDb()
    db.get(`DROP TABLE ${table_name}`)
    closeDb(db)
};

function closeDb(db){
   
   return db.close((err)=>{
        if(err){
            return err
        }
    });
};
module.exports={
    createTable,deleteTable,insertData,openDb,closeDb,
}