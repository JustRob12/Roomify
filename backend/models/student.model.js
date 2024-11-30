const mongoose = require('mongoose');
const User = require('./user.model');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    enum: ['1', '2', '3', '4'],
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
  },
});

const Student = User.discriminator('Student', studentSchema);

module.exports = Student;
