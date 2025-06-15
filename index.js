require('dotenv').config();
const app = require('express')();
const mongoose = require('mongoose');
const User = require('./models/users');

app.use(require('express').json());

app.post('/api/users', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const newUser = new User({ firstName, lastName, email, password });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    // Handle duplicate email error
    // MongoDB returns a 11000 error code for duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    // If the error is not a validation error or duplicate key error, return a generic error message  
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);  
  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    // If the error is not a validation error or duplicate key error, return a generic error message  
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  User.findById(id).then(user => {
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  }).catch(err => {
    res.status(500).json({ error: 'Internal server error' });
  });
});

app.get('/api/users', (req, res) => {
  User.find().then(users => {
    res.status(200).json(users);
  }).catch(err => {
    res.status(500).json({ error: 'Internal server error' });
  });
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
  app.listen(7777)
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});