const db = require('../config/connection');

class User {
  constructor(username, score) {
    this.username = username;
    this.score = score;
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
  static update() {
    let sql = `
    SET
      username = '${this.username}',
      score = '${this.score}'
    WHERE id = ${id};
  `;

    return db.execute(sql);
  }

  static findAll() {
    let sql = "SELECT * FROM users;";

    return db.execute(sql);
  }

  static findById(id) {
    let sql = `SELECT * FROM users WHERE id = ${id};`;
    
    return db.execute(sql);
  }
}

module.exports = User;