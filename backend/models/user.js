const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: false  // Change to true if you want to require DOB for registration
  }
});

module.exports = mongoose.model('User', UserSchema);
