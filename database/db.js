const mysql = require('mysql');
const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'project'
});
//check connect db
dbConnection.connect((error) =>{
    if(!!error){
      console.log('error');
    }else{
      console.log('Connected Successfully');
    }
    
})
module.exports = dbConnection;