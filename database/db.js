const mysql = require('mysql2');
// const dbConnection = mysql.createConnection({
//   host: 'localhost',
//   user: 'saduak_project',
//   password: '9KVj@uw29Irmqzk@',
//   port:3306,
//   database: 'saduak_project'
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