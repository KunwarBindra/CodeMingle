const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true,
      'First name is required'
    ],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true,
      'Last name is required'
    ],
    trim: true,
  },
  email: {
    type: String,
    required: [true,
      'Email is required'
    ],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Invalid email format',
    },
    immutable: true, // Prevents email from being changed after creation
  },
  password: {
    type: String,
    required: [true,
      'Password is required'
    ],
    validate: {
      validator: (value) => validator.isStrongPassword(value),
      message: 'Password must have at least 8 characters, including uppercase, lowercase, numbers, and symbols',
    },
  },
  profilePicture: {
    type: String,
    default: 'https://st.depositphotos.com/57803962/59532/v/450/depositphotos_595325804-stock-illustration-vector-illustration-programmer-icon.jpg', // Default profile picture URL
    trim: true,
  },
  about: {
    type: String,
    default: 'Hi there! I am using this app to connect with others.',
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Invalid gender value',
    }
  },
  skills: {
    type: [String],
    default: [],
  },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;
