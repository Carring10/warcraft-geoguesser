const mysql = require("mysql2/promise");
require('dotenv').config();

let connection;

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
  console.log('Connected to JawsDB database.');
} else {
  connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
  console.log('Connected to the local database.');
}

connection.connect();

module.exports = connection;