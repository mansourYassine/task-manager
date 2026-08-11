import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/Layout';
export default function App() {

    const router = createBrowserRouter([
        {path: '/', Component: Layout}
    ])
    
    return (
        <RouterProvider router={router} />
    );
}

