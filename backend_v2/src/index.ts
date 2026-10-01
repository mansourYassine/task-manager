import express from 'express';
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask, updateTaskStatus } from './controllers/task.controller.js';
import cors from 'cors';
import { validateBody, validateParams } from './middlewares/validation.middleware.js';
import { createTaskSchema, taskParamsSchema, updateStatusSchema, updateTaskSchema } from './validations/task.validation.js';
import { handleWrongPaths } from './middlewares/hanlde-wrong-paths.middleware.js';
import { errorHandler } from './middlewares/error-handling.middleware.js';
import { handleMalformedJson } from './middlewares/handleMalformedJson.middleware.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(handleMalformedJson);

app.get('/api/tasks', getAllTasks);
app.get('/api/tasks/:taskId', validateParams(taskParamsSchema), getTaskById);
app.post('/api/tasks', validateBody(createTaskSchema), createTask)
app.put('/api/tasks/:taskId', validateParams(taskParamsSchema), validateBody(updateTaskSchema), updateTask);
app.patch('/api/tasks/:taskId/status', validateParams(taskParamsSchema), validateBody(updateStatusSchema), updateTaskStatus);
app.delete('/api/tasks/:taskId', validateParams(taskParamsSchema), deleteTask);
app.use(handleWrongPaths);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})