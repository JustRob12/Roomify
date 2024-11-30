const express = require('express');
const router = express.Router();
const Classroom = require('../models/classroom.model');
const auth = require('../middleware/auth.middleware');

// Create a new classroom (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { name, capacity, description, grade, section } = req.body;
    
    // Check if classroom already exists
    const existingClassroom = await Classroom.findOne({ name });
    if (existingClassroom) {
      return res.status(400).json({ message: 'Classroom already exists' });
    }

    const classroom = new Classroom({
      name,
      capacity,
      description,
      grade,
      section,
      students: [],
      subjects: []
    });

    await classroom.save();
    res.status(201).json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all classrooms
router.get('/', auth, async (req, res) => {
  try {
    const classrooms = await Classroom.find()
      .populate('students', 'username name')
      .populate('subjects.subject', 'name code')
      .populate('subjects.faculty', 'username name');
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific classroom
router.get('/:id', auth, async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate('students', 'username name')
      .populate('subjects.subject', 'name code')
      .populate('subjects.faculty', 'username name');
    
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a classroom (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const updates = req.body;
    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a classroom (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const classroom = await Classroom.findByIdAndDelete(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.json({ message: 'Classroom deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add students to classroom (Admin only)
router.post('/:id/students', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { studentIds } = req.body;
    const classroom = await Classroom.findById(req.params.id);
    
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    classroom.students = [...new Set([...classroom.students, ...studentIds])];
    await classroom.save();
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
