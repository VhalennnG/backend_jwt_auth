const mysql = require("mysql");

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'jwt_auth'
});

db.connect(err => {
  if(err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connection')
  }
})

module.exports = db;