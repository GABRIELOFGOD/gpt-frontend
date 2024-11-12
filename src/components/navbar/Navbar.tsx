import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useAccount, useSignMessage } from 'wagmi';
import { NavLiistType, navList } from "../../utils/contants";

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { isConnected } = useAccount();
  const { signMessage } = useSignMessage();
  const navigate = useNavigate();

  const handleSignMessage = async () => {
    if (isConnected) {
      const message = "Please sign this message to verify your wallet ownership.";
      try {
        const signature = signMessage({ message });
        console.log("Signature:", signature);
        navigate('/investments')
        // You can now use the signature for verification
      } catch (error) {
        console.error("Error signing message:", error);
      }
    }
  };

  return (
    <div className="flex bg-secondary top-0 sticky z-50 justify-between py-2 px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className=" text-white font-bold text-2xl">GPT Bot</div>
      </div>
      <div className={`my-auto flex md:flex-row flex-col gap-5 text-white font-semibold text-lg bg-primary md:bg-transparent duration-200 absolute md:relative w-full md:w-fit left-0 md:left-auto ${navOpen ? "top-14" : "top-[-1000px]"} px-6 md:px-0 py-10 md:py-0 md:top-auto`}>
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
      </div>
      <div className="flex items-center space-x-4">
        {isConnected ? (
          <button onClick={handleSignMessage} className="text-sm font-semibold text-gray-500">
            Sign Message
          </button>
        ) : (
          <ConnectButton showBalance={true} />
        )}
        <div onClick={() => setNavOpen(!navOpen)} className="flex text-white md:hidden">
          <IoMenu color="#ffff" size={25} />
        </div>
      </div>
    </div>
  )
}

export default Navbar