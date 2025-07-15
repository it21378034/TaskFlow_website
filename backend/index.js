const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://user:user@cluster0.sb4y0ml.mongodb.net/taskflow?retryWrites=true&w=majority');

// Example Task schema
const Task = mongoose.model('Task', {
  title: String,
  description: String,
  completed: Boolean,
});

// User schema
const User = mongoose.model('User', {
  username: String,
  email: String,
  password: String, // In production, hash passwords!
});

// API routes
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  // TODO: Add validation and password hashing!
  const user = new User({ username, email, password });
  await user.save();
  res.json({ message: 'User created', user });
});

app.listen(5000, () => console.log('Server running on port 5000'));
