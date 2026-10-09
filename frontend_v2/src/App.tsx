import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/Layout';
import AllTasks from './pages/AllTasks';
import { loader as allTasksLoader } from './loaders/allTasksLoader';
import NotFound from './pages/NotFound';
import NewTask from './pages/NewTask';
import TaskDetails from './pages/TaskDetails';
import taskDetailsLoaders from './loaders/taskDetailsLoader';

export default function App() {
    const router = createBrowserRouter([
        {
            path: '/tasks', 
            Component: Layout,
            children: [
                {index: true, Component: AllTasks, loader: allTasksLoader},
                {path: 'create', Component: NewTask},
                {path: ':taskId', Component: TaskDetails, loader: taskDetailsLoaders}
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

