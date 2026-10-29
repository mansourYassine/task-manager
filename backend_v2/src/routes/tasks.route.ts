import express from "express";
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask, updateTaskStatus } from '../controllers/task.controller.js';
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';
import { createTaskSchema, taskParamsSchema, updateStatusSchema, updateTaskSchema } from '../validations/task.validation.js';
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get('/', authorize("admin", "employee"), getAllTasks);
router.get('/:taskId', authorize("admin", "employee"), validateParams(taskParamsSchema), getTaskById);
router.post('/', authorize("admin"), validateBody(createTaskSchema), createTask)
router.put('/:taskId', authorize("admin"), validateParams(taskParamsSchema), validateBody(updateTaskSchema), updateTask);
router.patch('/:taskId/status', authorize("admin", "employee"), validateParams(taskParamsSchema), validateBody(updateStatusSchema), updateTaskStatus);
router.delete('/:taskId', authorize("admin"), validateParams(taskParamsSchema), deleteTask);

export default router;