require('dotenv').config();
const app = require('express')();
const mongoose = require('mongoose');
const User = require('./models/users');

app.use(require('express').json());

app.post('/api/users', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const existingUser = await User.find({ email: email });
  if (existingUser.length) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const newUser = new User({ firstName, lastName, email, password });
  newUser.save()
    .then(user => res.status(200).json(user))
    .catch(err => {
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.patch('/api/users/:id', (req, res) => {
  const { id } = req.params;
  User.findByIdAndUpdate(id, req.body).then(user => {
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  }).catch(err => {
    res.status(500).json({ error: 'Internal server error' });
  });
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