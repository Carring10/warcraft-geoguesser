const mysql = require("mysql2");
require('dotenv').config();

const db = mysql.createConnection(
  {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  console.log(`Connected to the database.`)
);

db.connect((err) => {
  if (err) throw err;
});

module.exports = db;