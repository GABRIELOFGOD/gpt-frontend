import { ConnectButton } from "@rainbow-me/rainbowkit"
import { IoMenu } from "react-icons/io5";
import { NavLiistType, navList } from "../../utils/contants";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  
  return(
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
        <div className="text-sm font-semibold text-gray-500"><ConnectButton showBalance={true} /></div>
        <div onClick={() => setNavOpen(!navOpen)} className="flex text-white md:hidden">
          <IoMenu color="#ffff" size={25} />
        </div>
      </div>
    </div>
  )
}

export default Navbar