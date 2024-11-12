import { useEffect } from "react"
import { useGlobalContext } from "../components/context/GlobalContext";
import { useNavigate } from "react-router-dom";

const availableSub: number[] = [
  100, 300, 500, 1000, 3000, 5000, 10000, 25000, 50000, 100000
]

const Investment = () => {
  const { userWallet } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if(!userWallet){
      navigate("/");
    }
  }, [navigate, userWallet]);
  
  return (
    <div className="px-3 md:px-52 flex flex-col gap-10 py-10 md:py-20">
      <div className="border-secondary rounded-md border">
        <div className="bg-secondary text-white px-10 w-full py-3">
          <p className="text-2xl font-semibold">Subscriptions</p>
        </div>
        <div className="px-3">
          <p className="text-secondary opacity-60 text-center py-3 md:text-xl text-lg font-semibold">Grab a New Plan or Upgrade before slots are full</p>
          <div className="py-4 md:px-8 px-4 bg-light flex flex-wrap gap-3 rounded-md justify-evenly">
            {availableSub.map((item, i) => (
              <button
                key={i}
                onClick={()=>{}}
                className="bg-secondary bg-opacity-5 font-semibold md:text-lg text-base w-[75px] rounded-sm py-2 text-white"
              >${item}</button>
            ))}
          </div>
          <div className="py-10 flex flex-col gap-3">
            <div className="flex justify-between font-semibold text-lg">
              <p>USDT Balance:</p>
              <p>0.00</p>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <p>BNB Balance:</p>
              <p>0.00</p>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <p>Total USDT Invested:</p>
              <p>0.00</p>
            </div>
          </div>
          <button className="flex justify-center w-full rounded-md py-2 bg-secondary text-white mb-5 text-lg font-semibold">Invest</button>
        </div>
      </div>

      <div className="border-secondary rounded-md border">
        <div className="bg-secondary text-white px-10 w-full py-3">
          <p className="text-2xl font-semibold">Earnings</p>
        </div>
        <div className="px-3 py-10 flex flex-col gap-3">
          <div className="bg-light text-secondary text-lg font-semibold rounded-md px-3 flex justify-between py-2">
            <p>Total Direct</p>
            <p>0</p>
          </div>
          <div className="bg-light text-secondary text-lg font-semibold rounded-md px-3 flex justify-between py-2">
            <p>Total Downlines</p>
            <p>0</p>
          </div>
          <div className="bg-light text-secondary text-lg font-semibold rounded-md px-3 flex justify-between py-2">
            <p>Total Business</p>
            <p>0</p>
          </div>
          <div className="bg-light text-secondary text-lg font-semibold rounded-md px-3 flex justify-between py-2">
            <p>Direct Volume</p>
            <p>0</p>
          </div>
          <div className="bg-light text-secondary text-lg font-semibold rounded-md px-3 flex justify-between py-2">
            <p>Team Volume</p>
            <p>0</p>
          </div>
        </div>
      </div>

      <div className="w-full p-3 bg-light rounded-md flex flex-col gap-5">
        <p className="text-2xl font-semibold">Referral Link</p>
        <div className="flex flex-col md:flex-row gap-2">
          <input type="text" className="w-full outline-none h-12 rounded-md px-3 border border-secondary"  disabled/>
          <button className="flex justify-center w-full md:w-fit px-8 rounded-md py-2 bg-secondary text-white mb-5 text-lg font-semibold">Copy</button>
        </div>
      </div>
    </div>
  )
}

export default Investment