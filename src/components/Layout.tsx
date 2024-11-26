import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Loading from "./Loading";
import { useEffect } from "react";
import LoginModal from "./LoginModal";
import { useGlobalContext } from "./context/GlobalContext";

const Layout = () => {
  // const [loading, setLoading] = useState(false);

  const { userProfile, authenticated, generalLoading: loading, setGeneralLoading: setLoading } = useGlobalContext();
  
  useEffect(() => {
    setLoading(true);
    const userToken = localStorage.getItem('user');
    if (!authenticated) {
      if(userToken){
        userProfile();
      }
    }
    setLoading(false);
  },[])

  
  return (
    <div>
      { loading ? <Loading /> : !authenticated ? <LoginModal /> :
        <div>
          <Navbar />
          <Outlet />
        </div>
      }
    </div>
  )
}

export default Layout