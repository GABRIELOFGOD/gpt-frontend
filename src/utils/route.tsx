import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home';
import Investment from '../pages/Investment';

const route = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "investment",
        element: <Investment />
      }
    ]
  }
]);

export default route