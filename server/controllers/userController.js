const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    // Underscore to ignore field data
    const [users, _] = await User.findAll();

    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
  }
}

exports.createNewUser = async (req, res) => {
  try {
    let { username, score } = req.body;
    let user = new User(username, score);

    user = await user.create();

    res.status(201).json({ message: "User created!" });
  } catch (err) {
    console.log(err);
  }
}

exports.updateScore = async (req, res) => {
  try {
    const username = req.params.username;
    const score = req.body.score;

    const updatedScore = await User.update(username, score);

    res.status(200).json({ updatedScore });
  } catch (err) {
    console.log(err)
  }
}