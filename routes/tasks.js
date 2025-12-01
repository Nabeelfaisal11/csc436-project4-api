// routes/tasks.js
const express = require('express');
const router = express.Router();

// In-memory "database"
let tasks = [
  { id: 1, title: 'Learn Express', completed: false },
  { id: 2, title: 'Finish CSC 436 Project 4', completed: false }
];

let nextId = 3; // ID for new tasks

// GET /api/tasks - get all tasks
router.get('/', (req, res) => {
  res.status(200).json(tasks);
});

// GET /api/tasks/:id - get one task by id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json(task);
});

// POST /api/tasks - create a new task
router.post('/', (req, res) => {
  const { title, completed } = req.body;

  // Validation (400 Bad Request)
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be a string' });
  }

  const newTask = {
    id: nextId++,
    title,
    completed: completed === true // default false if not provided
  };

  tasks.push(newTask);
  res.status(201).json(newTask); // 201 Created
});

// PUT /api/tasks/:id - update a task
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, completed } = req.body;

  if (title !== undefined && typeof title !== 'string') {
    return res.status(400).json({ error: 'Title must be a string if provided' });
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean if provided' });
  }

  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.status(200).json(task);
});

// DELETE /api/tasks/:id - delete a task
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = tasks.splice(index, 1)[0];
  res.status(200).json({
    message: 'Task deleted successfully',
    deletedTask
  });
});

module.exports = router;
