import express, { json } from 'express';
import { createTask, getAllTasks, getTaskById, updataTask, updateTaskStatus } from './controllers/task.controller.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/tasks', getAllTasks);
app.get('/api/tasks/:taskId', getTaskById);
app.post('/api/tasks', createTask)
app.put('/api/tasks/:taskId', updataTask);
app.patch('/api/tasks/:taskId/status', updateTaskStatus);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})