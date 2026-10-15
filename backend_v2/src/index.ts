import express from 'express';
import cors from 'cors';
import { validateBody, validateParams } from './middlewares/validation.middleware.js';
import { handleWrongPaths } from './middlewares/hanlde-wrong-paths.middleware.js';
import { errorHandler } from './middlewares/error-handling.middleware.js';
import { handleMalformedJson } from './middlewares/handleMalformedJson.middleware.js';
import tasksRouter from './routes/tasks.route.js';
import { login, register } from './controllers/auth.controller.js';
import { loginUserSchema, registerUserSchema } from './validations/user.validation.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(handleMalformedJson);

app.post('/auth/register', validateBody(registerUserSchema), register);
app.post('/auth/login', validateBody(loginUserSchema), login);
app.use('/api/tasks', tasksRouter);
app.use(handleWrongPaths);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})