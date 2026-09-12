import express from 'express';
import { getAllTasks, getTaskById } from './controllers/task.controller.js';

const app = express();
const PORT = 3000;

app.get('/api/tasks', getAllTasks);
app.get('/api/tasks/:taskId', getTaskById);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})