import { ConnectButton } from "@rainbow-me/rainbowkit"

const Navbar = () => {
  return(
    <div className="flex bg-primary justify-between py-2 px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className=" text-white font-bold text-2xl">GPT Bot</div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-sm font-semibold text-gray-500"><ConnectButton showBalance={true} /></div>
      </div>
    </div>
  )
}

export default Navbar