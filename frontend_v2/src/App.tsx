import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import Layout from './components/Layout';
import AllTasks from './pages/AllTasks';
import allTasksLoader from './loaders/allTasksLoader';
import NotFound from './pages/NotFound';
import NewTask from './pages/NewTask';
import TaskDetails from './pages/TaskDetails';
import taskDetailsLoader from './loaders/taskDetailsLoader';
import EditTask from './pages/EditTask';
import editTaskLoader from './loaders/editTaskLoader';
import Login from './pages/Login';
import { parentTasksLoader } from './loaders/parentTasksLoader';
import { loginLoader } from './loaders/loginLoader';
import createTaskLoader from './loaders/createTaskLoader';
import Register from './pages/Register';

export default function App() {
    const router = createBrowserRouter([
        {
            path: '/login',
            Component: Login,
            loader: loginLoader,
        },
        {
            path: '/register',
            Component: Register,
            loader: loginLoader,
        },
        {
            path: '/',
            element: <Navigate to="/tasks" replace />
        },
        {
            path: '/tasks', 
            Component: Layout,
            loader: parentTasksLoader,
            children: [
                {index: true, Component: AllTasks, loader: allTasksLoader},
                {path: 'create', Component: NewTask, loader: createTaskLoader},
                {path: ':taskId', Component: TaskDetails, loader: taskDetailsLoader},
                {path: ':taskId/edit', Component: EditTask, loader: editTaskLoader}
            ]            
        },
        {
            path: '/not-found',
            Component: NotFound
        },
        {
            path: '*',
            Component: NotFound
        }
    ])
    
    return (
        <RouterProvider router={router} />
    );
}

