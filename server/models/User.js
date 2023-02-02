const db = require('../config/connection');

class User {
  constructor(username, score) {
    this.username = username;
    this.score = score;
  }
  // Save new user to the database
  save() {
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

  static findAll() {
    let sql = "SELECT * FROM users;";

    return db.execute(sql);
  }
}

module.exports = User;