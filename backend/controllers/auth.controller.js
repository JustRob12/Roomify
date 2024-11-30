const jwt = require('jsonwebtoken');
const Student = require('../models/student.model');
const Faculty = require('../models/faculty.model');
const Admin = require('../models/admin.model');
const User = require('../models/user.model');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.register = async (req, res) => {
  try {
    const { role, ...userData } = req.body;

    let UserModel;
    switch (role) {
      case 'Student':
        UserModel = Student;
        break;
      case 'Faculty':
        UserModel = Faculty;
        break;
      case 'Admin':
        UserModel = Admin;
        break;
      default:
        return res.status(400).json({
          message: 'Invalid role specified',
        });
    }

    const user = await UserModel.create(userData);
    createSendToken(user, 201, res);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password exist
    if (!username || !password) {
      return res.status(400).json({
        message: 'Please provide username and password',
      });
    }

    // Find user by username
    const user = await User.findOne({ username }).select('+password');

    // Check if user exists && password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: 'Incorrect username or password',
      });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
