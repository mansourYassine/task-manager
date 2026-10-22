import { createBrowserRouter, RouterProvider } from 'react-router';
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
import { ParentTasksLoader } from './loaders/ParentTasksLoader';

export default function App() {
    const router = createBrowserRouter([
        {
            path: '/login',
            Component: Login
        },
        {
            path: '/tasks', 
            Component: Layout,
            loader: ParentTasksLoader,
            children: [
                {index: true, Component: AllTasks, loader: allTasksLoader},
                {path: 'create', Component: NewTask},
                {path: ':taskId', Component: TaskDetails, loader: taskDetailsLoader},
                {path: ':taskId/edit', Component: EditTask, loader: editTaskLoader}
            ]            
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

