var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

//sign up for account
router.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  //hash password
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {

      //store user info
      var user = User({
        username: username,
        password: hash
      });

      user.save(function(err, user) {
        if (err) {
          console.log("error: ", err);
          res.send(err);
        }
        else {
          console.log('user was saved:', user);
          //create token
          var token = jwt.sign(user, router.get('superSecret'), { expiresInminutes:1440 });
          //send token
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token,
            username: user.username,
            password: user.password
          });
        }
      });

    });
  });
});

module.exports = router;