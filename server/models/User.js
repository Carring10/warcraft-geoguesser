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
      score,
      lives,
      hints
    )
    VALUES(
      '${this.username}',
      '${this.score}',
      '3',
      '3'
    )
    `;

    const newUser = db.execute(sql);

    return newUser;
  }
  // Update user's score
  static updateScore(username, score) {
    let sql = `
    UPDATE users
    SET score = ${score} 
    WHERE username = '${username}'; 
    `;

    return db.execute(sql);
  }
}

module.exports = User;