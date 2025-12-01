const express = require('express');
const app = express();
const tasksRouter = require('./routes/tasks');

app.use(express.json());

// Serve website
app.use(express.static('public'));

// API routes
app.use('/api/tasks', tasksRouter);

// Home route (optional)
app.get('/', (req, res) => {
  res.json({ message: 'CSC 436 Project 4 API is running' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
