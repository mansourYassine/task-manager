import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/Layout';
import AllTasks from './pages/AllTasks';
import { loader as allTasksLoader } from './loaders/allTasksLoader';
import NotFound from './pages/NotFound';
import NewTask from './pages/NewTask';

export default function App() {
    const router = createBrowserRouter([
        {
            path: '/', 
            Component: Layout,
            children: [
                {index: true, Component: AllTasks, loader: allTasksLoader},
                {path: 'create', Component: NewTask}
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

