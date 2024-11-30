const mongoose = require('mongoose');
const User = require('./user.model');

const facultySchema = new mongoose.Schema({
  facultyId: {
    type: String,
    required: [true, 'Faculty ID is required'],
    unique: true,
  },
  faculty: {
    type: String,
    required: [true, 'Faculty is required'],
  },
});

const Faculty = User.discriminator('Faculty', facultySchema);

module.exports = Faculty;
