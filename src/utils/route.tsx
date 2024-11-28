import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home';
import Withrawals from '../pages/Withrawals';
import ReferralHistory from '../pages/ReferralHistory';
import Investment from '../pages/Investment';
import Admin from '../pages/Admin';
import Swap from '../pages/Swap';
import Game from '../pages/Game';

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
        path: "investments",
        element: <Investment />
      },
      {
        path: "records",
        element: <Withrawals />
      },
      {
        path: "referral-history",
        element: <ReferralHistory />
      },
      {
        path: "admin",
        element: <Admin />
      },
      {
        path: "swap",
        element: <Swap />
      },
      {
        path: "games",
        element: <Game />
      }
    ]
  }
]);

export default route