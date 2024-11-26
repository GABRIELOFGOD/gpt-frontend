import { useState } from "react";
import Login from "./navbar/Login";
import Register from "./navbar/Register";

const LoginModal = () => {
  const [screen, setScreen] = useState('login');
  
  return (
    <div className="flex fixed top-0 left-0 z-50 justify-center items-center w-full h-screen p-3 md:p-10 flex-col">
      <div className="fixed top-0 left-0 w-full h-screen -z-20">
        <img src="/images/bg.avif" className="h-full" alt="background image" />
      </div>
      <div className="fixed top-0 left-0 h-screen w-full bg-black bg-opacity-50 -z-20"></div>
      <div className="w-full">
        {screen === 'login' && <Login setScreen={setScreen} />}
        {screen === 'register' && <Register setScreen={setScreen} />}
      </div>
    </div>
  )
}

export default LoginModal;