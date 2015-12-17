'use strict';

let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: String,
    firstName: String,
    lastName: String,
    phone: String,
    city: String,
    state: String,
    updated: {type: Date, default: Date.now},
  });

userSchema.methods.encryptPass = function(cb) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.log(err);
      cb(err);
    }
    else {
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) {
          cb(err);
        }
        else {
          this.password = hash;
          cb(null);
        }
      });
    }
  });
}

userSchema.methods.validatePass = function(pass, cb) {
  bcrypt.compare(pass, this.password, cb);
}

userSchema.methods.token = function(cb) {
  try {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {expiresIn: 24 * 60 * 60});
  }
  catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = mongoose.model('users', userSchema);
