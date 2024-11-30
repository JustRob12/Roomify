const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  subjects: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Classroom', classroomSchema);
