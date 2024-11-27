import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useAccount, useDisconnect } from 'wagmi';
import { NavLiistType, navList } from "../../utils/contants";
// import { useGlobalContext } from "../context/GlobalContext";
import toast from "react-hot-toast";
// import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { isConnected } = useAccount();
  // const { signMessage } = useSignMessage();
  // const navigate = useNavigate();
  // const { setUserWallet, userLogin, userProfile } = useGlobalContext();
  const { disconnect } = useDisconnect();

  const logout = async () => {
    await disconnect();
    localStorage.removeItem("user");
    toast.success("Logout successful");
    location.reload();
  };

  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const ref = queryParams.get('ref');

  // useEffect(() => {
  //   const handleSignMessage = async () => {
  //     if (isConnected) {
  //       const message = "Please sign this message to verify your wallet ownership.";
  //       console.log("Query params", ref);
  //       try {
  //         toast.loading(message);
  
  //         // Attempt to sign in with the user's wallet
  //         const loggedIn = await userLogin(address as string, ref ? ref : undefined);
  //         if(!loggedIn) disconnect();
          
  //         toast.dismiss();
  //         toast.success("Wallet connected successfully");
  //         if(location.pathname == "/") navigate('/investments');
  //       } catch (error) {
  //         // Handle the error (e.g., failed login)
  //         console.error("Error signing message:", error);
          
  //         // Disconnect the wallet if login fails
  //         await disconnect(); // Disconnect the wallet
  //         toast.dismiss();
  //         toast.error("Failed to connect wallet. Please try again.");
  //         navigate('/'); // Redirect user to home or login page
  //       }
  //     }
  //   };
  
  //   // Only call handleSignMessage if the connector is available
  //   if (connector) {
  //     handleSignMessage();
  //   }
  // }, [address, isConnected, connector, userLogin, navigate]);

  // Effect to update the global context when the wallet is connected
  // useEffect(() => {
  //   if (isConnected && address) {
  //     setUserWallet(address);
  //   }
  //   userProfile();
  // }, [isConnected, address, setUserWallet]);

  return (
    <div className="flex bg-secondary top-0 sticky z-50 justify-between py-2 px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <img className="w-[50px]" src="/static/3.png" alt="Logo" />
        <p className=" text-white my-auto font-bold text-2xl">GPT Bot</p>
      </div>
      <div className={`my-auto flex cursor-pointer md:flex-row flex-col gap-5 text-white font-semibold text-lg bg-primary md:bg-transparent duration-200 absolute md:relative w-full md:w-fit left-0 md:left-auto ${navOpen ? "top-14" : "top-[-1000px]"} px-6 md:px-0 py-10 md:py-0 md:top-auto`}>
        {navList.map((item: NavLiistType, i: number) => (
          <Link
            to={item.path}
            key={i}
            className="py-2"
            onClick={() => setNavOpen(false)}
          >
            {item.name}
          </Link>
        ))}
        <button
          className="py-2 w-fit"
          onClick={logout}
        >
          Logout
        </button>
      </div>
      <div className="flex items-center space-x-4">
        {isConnected ? (
          <button
        onClick={async () => {
          await disconnect();
          toast.success("Wallet disconnected successfully");
        }}
        className="text-white bg-red-500 px-4 py-2 rounded"
          >
        Disconnect
          </button>
        ) : (
          <ConnectButton label="Connect" showBalance={false} />
        )}
        <div onClick={() => setNavOpen(!navOpen)} className="flex text-white md:hidden">
          <IoMenu color="#ffff" size={25} />
        </div>
      </div>
    </div >
  )
}
export default Navbar;