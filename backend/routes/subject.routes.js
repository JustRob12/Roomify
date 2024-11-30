const express = require('express');
const router = express.Router();
const Subject = require('../models/subject.model');
const auth = require('../middleware/auth.middleware');

// Create a new subject (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { name, code, description, credits, department } = req.body;
    
    // Check if subject already exists
    const existingSubject = await Subject.findOne({ code });
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject with this code already exists' });
    }

    const subject = new Subject({
      name,
      code,
      description,
      credits,
      department,
      classrooms: []
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all subjects
router.get('/', auth, async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('classrooms.classroom', 'name grade section')
      .populate('classrooms.faculty', 'username name');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific subject
router.get('/:id', auth, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('classrooms.classroom', 'name grade section')
      .populate('classrooms.faculty', 'username name');
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a subject (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const updates = req.body;
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a subject (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign faculty to subject in a classroom (Admin only)
router.post('/:id/assign', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { classroomId, facultyId } = req.body;
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check if assignment already exists
    const existingAssignment = subject.classrooms.find(
      c => c.classroom.toString() === classroomId && c.faculty.toString() === facultyId
    );

    if (existingAssignment) {
      return res.status(400).json({ message: 'Assignment already exists' });
    }

    subject.classrooms.push({ classroom: classroomId, faculty: facultyId });
    await subject.save();
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
