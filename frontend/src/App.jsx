import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/Layout';
import AllTasks, {loader as allTasksLoader} from './pages/AllTasks'
import NotFound from './pages/NotFound';

export default function App() {
    const router = createBrowserRouter([
        {
            path: '/', 
            Component: Layout,
            children: [
                {index: true, Component: AllTasks, loader: allTasksLoader}
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

