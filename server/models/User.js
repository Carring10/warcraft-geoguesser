const db = require('../config/connection');

class User {
  constructor(username, score) {
    this.username = username;
    this.score = score;
  }

  static findAll() {
    let sql = "SELECT * FROM users;";

    return db.execute(sql);
  }
  // Save new user to the database
  create() {
    let sql = `
    INSERT INTO users(
      username,
      score
    )
    VALUES(
      '${this.username}',
      '${this.score}'
    )
    `;

    const newUser = db.execute(sql);

    return newUser;
  }
  // Update user's score
  static update(username, score) {
    let sql = `
    UPDATE users
    SET score = ${score} 
    WHERE username = '${username}'; 
    `;

    return db.execute(sql);
  }
}

module.exports = User;