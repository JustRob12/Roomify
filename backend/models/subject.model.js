const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  classrooms: [{
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom'
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

module.exports = mongoose.model('Subject', subjectSchema);
