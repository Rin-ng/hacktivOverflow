var express = require('express');
var router = express.Router();

/* GET users listing. */
router
  .post('/login', userController.signIn)
  .post('/register', userController.signUp)
  .post('/fbLogin', userController.fbSignIn)

module.exports = router;
