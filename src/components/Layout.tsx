import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Loading from "./Loading";
import { useEffect } from "react";
import LoginModal from "./LoginModal";
import { useGlobalContext } from "./context/GlobalContext";

const Layout = () => {
  // const [loading, setLoading] = useState(false);

  const { userProfile, authenticated, generalLoading: loading, setGeneralLoading: setLoading, updateTokenPrice } = useGlobalContext();
  
  useEffect(() => {
    setLoading(true);
    const userToken = localStorage.getItem('user');
    if (!authenticated) {
      if(userToken){
        userProfile();
        updateTokenPrice();
      }
    }
    setLoading(false);
  },[])

  const location = useLocation();

  const excempted = ["/dashboard/users", "/dashboard", "/dashboard/requests", "/dashboard/withrawal-report", "/dashboard/investments", "/dashboard/support"]
  
  return (
    <div>
      { loading ? <Loading /> : !authenticated ? location.pathname === '/reset-password' ? <Outlet /> :
        <LoginModal /> :
        <div>
          {!excempted.includes(location.pathname) && <Navbar />}
          <Outlet />
        </div>
      }
    </div>
  )
}

export default Layout