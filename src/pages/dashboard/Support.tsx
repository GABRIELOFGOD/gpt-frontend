import toast from "react-hot-toast";
import { useGlobalContext } from "../../components/context/GlobalContext"
import useCoin from "../../hooks/useCoin";
import { useEffect } from "react";

const Support = () => {
  const { userProfileState } = useGlobalContext();

  const { coinPrice, error, fetchCoinPrice, loading, handleCoinPriceChange, updateCoinPrice } = useCoin();

  if (error) {
    toast.error(error);
  }

  useEffect(() => {
    fetchCoinPrice();
  },[]);
  
  return (
    <div className="flex flex-col gap-10">
      <p className="text-xl">Welcome to support <b>{userProfileState?.name}</b></p>
      <div className="w-full md:w-[300px] bg-white p-3 rounded-md">
        <p className="font-bold text-lg">GPTCOIN PRICE</p>
        <div className="flex flex-col gap-3 py-5">
          <input className="w-full outline-none bg-light h-12 rounded-md px-3" type="number" value={coinPrice} onChange={handleCoinPriceChange} />
          <button
            className={`w-full h-12 justify-center items-center bg-primary hover:bg-neutral-900 duration-200 font-semibold text-white rounded-md ${loading ? "opacity-50" : ""}`}
            onClick={updateCoinPrice}
            disabled={loading}
          >
            {loading ? "Wait..." : "Update Coin Price"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Support