import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/Layout';
import AllTasks from './pages/AllTasks'

export default function App() {
    const router = createBrowserRouter([
        {
            path: '/', 
            Component: Layout,
            children: [
                {index: true, Component: AllTasks}
            ]
        }
    ])
    
    return (
        <RouterProvider router={router} />
    );
}

