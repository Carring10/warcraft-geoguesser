const User = require('../models/User');

exports.getAllUsers = async (req, res, next) => {
  res.send("Get all users route");
}

exports.createNewUser = async (req, res, next) => {
  let { username, score } = req.body;
  let user = new User(username, score);

  user = await user.save();

  console.log(user);

  res.send("Create user route");
}