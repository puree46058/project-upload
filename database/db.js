const mysql = require('mysql2');
// const dbConnection = mysql.createConnection({
//   host: 'localhost',
//   user: 'saduak_project',
//   password: '#aQw83f22',
//   port:3306,
//   database: 'project'
// });

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