import express from "express";
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask, updateTaskStatus } from '../controllers/task.controller.js';
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';
import { createTaskSchema, taskParamsSchema, updateStatusSchema, updateTaskSchema } from '../validations/task.validation.js';
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get('/', getAllTasks);
router.get('/:taskId', validateParams(taskParamsSchema), getTaskById);
router.post('/', validateBody(createTaskSchema), createTask)
router.put('/:taskId', validateParams(taskParamsSchema), validateBody(updateTaskSchema), updateTask);
router.patch('/:taskId/status', validateParams(taskParamsSchema), validateBody(updateStatusSchema), updateTaskStatus);
router.delete('/:taskId', validateParams(taskParamsSchema), deleteTask);

export default router;