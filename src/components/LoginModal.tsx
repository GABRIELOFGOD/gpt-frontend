import { useState, useEffect } from "react";
import Login from "./navbar/Login";
import Register from "./navbar/Register";
import ForgotPassword from "../pages/ForgotPassword";
import { useLocation } from "react-router-dom";

const LoginModal = () => {
  const [screen, setScreen] = useState('login');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ref = queryParams.get('ref');

  useEffect(() => {
    if(ref) {
      setScreen('register');
    }
  }, []);
  
  return (
    <div className="flex fixed top-0 left-0 z-50 justify-center items-center w-full h-screen p-3 md:p-10 flex-col">
      <div className="fixed top-0 left-0 w-full h-screen -z-20">
        <img src="/images/bg.avif" className="h-full w-full" alt="background image" />
      </div>
      <div className="fixed top-0 left-0 h-screen w-full bg-black bg-opacity-50 -z-20"></div>
      <div className="w-full flex justify-center items-center">
        {screen === 'login' && <Login setScreen={setScreen} />}
        {screen === 'register' && <Register setScreen={setScreen} />}
        {screen === 'forgot-password' && <ForgotPassword setScreen={setScreen} />}
      </div>
    </div>
  )
}

export default LoginModal;