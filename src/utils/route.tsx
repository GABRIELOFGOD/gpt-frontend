import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home';
import Withrawals from '../pages/Withrawals';
import ReferralHistory from '../pages/ReferralHistory';
import Investment from '../pages/Investment';
import Admin from '../pages/Admin';
import Swap from '../pages/Swap';
import Game from '../pages/Game';
import Dashboard from '../pages/dashboard/Dashboard';
import User from '../pages/dashboard/User';
import Withdrawal from '../pages/dashboard/Withdrawal';
import WithdrawalReport from '../pages/dashboard/WithdrawalReport';
import Investments from '../pages/dashboard/Investments';
import Support from '../pages/dashboard/Support';
import ResetPassword from '../pages/ResetPassword';

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
        path: "dashboard",
        element: <Admin />,
        children: [
          {
            path: "",
            element: <Dashboard />
          },
          {
            path: "users",
            element: <User />
          },
          {
            path: "requests",
            element: <Withdrawal />
          },
          {
            path: "withrawal-report",
            element: <WithdrawalReport />
          },
          {
            path: "investments",
            element: <Investments />
          },
          {
            path: "support",
            element: <Support />
          }
        ]
      },
      {
        path: "swap",
        element: <Swap />
      },
      {
        path: "games",
        element: <Game />
      },
      {
        path: "reset-password",
        element: <ResetPassword />
      }
    ]
  }
]);

export default route