const User = require('../models/User');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();

    res.status(200).json({users});
  } catch (err) {
    console.log(err);
  }
}

exports.createNewUser = async (req, res, next) => {
  try {
    let { username, score } = req.body;
    let user = new User(username, score);

    user = await user.save();

    res.status(201).json({ message: "User created!" });
  } catch (error) {
    console.log(err);
  }
}