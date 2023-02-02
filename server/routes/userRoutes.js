const express = require('express');
const userControllers = require('../controllers/userController');
const router = express.Router();

// @route GET and POST
router.route("/")
  .get(userControllers.getAllUsers)
  .post(userControllers.createNewUser);

module.exports = router;