import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useAccount, useDisconnect } from 'wagmi';
import { NavLiistType, navList } from "../../utils/contants";
import toast from "react-hot-toast";

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const logout = async () => {
    await disconnect();
    localStorage.removeItem("user");
    toast.success("Logout successful");
    location.reload();
  };

  return (
    <div className="flex bg-secondary top-0 sticky z-50 justify-between py-2 px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <img className="w-[50px]" src="/static/3.png" alt="Logo" />
        <p className=" text-white my-auto font-bold text-2xl">GPT Bot</p>
      </div>
      <div className={`my-auto flex cursor-pointer md:flex-row flex-col gap-5 text-white font-semibold text-base bg-primary md:bg-transparent duration-200 absolute md:relative w-full md:w-fit left-0 md:left-auto ${navOpen ? "top-14" : "top-[-1000px]"} px-6 md:px-0 py-10 md:py-0 md:top-auto`}>
        {navList.map((item: NavLiistType, i: number) => (
          <Link
            to={item.path}
            key={i}
            className="py-2 w-fit flex gap-1 my-auto"
            onClick={() => setNavOpen(false)}
          >
            <img src={item.image} alt={`${item.name} img`} className="w-[30px] h-fit my-auto" />
            <span className="my-auto">{item.name}</span>
          </Link>
        ))}
        <button
          className="py-2 w-fit text-base flex gap-1 my-auto"
          onClick={logout}
        >
          <img src="/MENU/LOGOUT.png" alt="Logout" className="w-[30px] my-auto" />
          <span className="my-auto">Logout</span>
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