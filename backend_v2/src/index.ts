import express from 'express';
import { getAllTasks, getTaskById } from './controllers/task.controller.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/tasks', getAllTasks);
app.get('/api/tasks/:taskId', getTaskById);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})