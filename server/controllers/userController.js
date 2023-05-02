const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
  }
}

exports.createNewUser = async (req, res) => {
  try {
    const { username, score } = req.body;
    let user = new User(username, score);

    user = await user.create();

    res.status(201).json({ user });
  } catch (err) {
    console.log(err);
  }
}

exports.updateScore = async (req, res) => {
  try {
    const username = req.params.username;
    const score = req.body.score;

    await User.updateScore(username, score);

    res.status(200).json({ message: "User's score updated!" });
  } catch (err) {
    console.log(err)
  }
}

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await User.delete(id);

    res.status(200).json({ message: "User deleted!" });
  } catch (err) {
    console.log(err);
  }
}
