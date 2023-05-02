const mysql = require("mysql2");
const util = require("util");
require('dotenv').config();

let db;

if (process.env.JAWSDB_URL) {
  db = mysql.createConnection(process.env.JAWSDB_URL);
  console.log('Connected to JawsDB database.');
} else {
  db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
  console.log('Connected to the local database.');
}

// promise wrapper to enable async await with MYSQL
// connection.query = util.promisify(connection.query).bind(connection);
db.connect((err) => {
  if (err) throw err;
});

let sql = "SELECT * FROM users;";

db.execute(sql, function (err, result) {
  if (err) throw err;

  console.log(result);
})

module.exports = db.promise();