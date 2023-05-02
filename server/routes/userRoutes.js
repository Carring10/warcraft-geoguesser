const express = require('express');
const userControllers = require('../controllers/userController');
const router = express.Router();

// @route GET and POST
router.route("/users")
  .get(userControllers.getAllUsers)
  .post(userControllers.createNewUser);
  
router.route("/:username").put(userControllers.updateScore);

router.route("/:id").delete(userControllers.delete);

module.exports = router;