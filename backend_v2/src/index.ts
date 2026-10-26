import express from 'express';
import cors from 'cors';
import { validateBody, validateParams } from './middlewares/validation.middleware.js';
import { handleWrongPaths } from './middlewares/hanlde-wrong-paths.middleware.js';
import { errorHandler } from './middlewares/error-handling.middleware.js';
import { handleMalformedJson } from './middlewares/handleMalformedJson.middleware.js';
import tasksRouter from './routes/tasks.route.js';
import { getUsers, login, logout, me, refresh, register } from './controllers/auth.controller.js';
import { loginUserSchema, registerUserSchema } from './validations/user.validation.js';
import cookieParser from 'cookie-parser';
import { authenticate } from './middlewares/auth.middleware.js';

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(handleMalformedJson);
app.use(cookieParser());

app.post('/auth/register', validateBody(registerUserSchema), register);
app.post('/auth/login', validateBody(loginUserSchema), login);
app.post('/auth/refresh', refresh);
app.post('/auth/logout', logout);
app.get('/auth/me', authenticate, me);
app.get('/auth/users-info', authenticate, getUsers);
app.use('/api/tasks', tasksRouter);
app.use(handleWrongPaths);
app.use(errorHandler);

export default app;