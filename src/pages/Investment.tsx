import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBalance, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { contractAbi } from "../../abi";
import { useGlobalContext } from "../components/context/GlobalContext";

import { tokenAbi } from "../../testabi";

const availableSub: number[] = [
  100, 300, 500, 1000, 3000, 5000, 10000, 25000, 50000, 100000
]

const Investment = () => {
  const { userWallet } = useGlobalContext();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const [usdtBalance, setUsdtBalance] = useState<string>("0");
  const [bnbBalance, setbnbBalance] = useState<string>("0");

  // Get USDT balance
  const { data: usdtData } = useReadContract({
    ...tokenAbi,
    address: '0x5A7a2426DD0597Ef689420a5EBA474b56157C2B1', // USDT contract address
    functionName: 'balanceOf',
    args: [userWallet as `0x${string}`],
  });

  // Get BNB balance
  const { data: bnbData } = useBalance({
    address: userWallet as `0x${string}`,
    chainId: 97,
  })

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })
  useEffect(() => {
    if (bnbData) {
      setbnbBalance(Number(bnbData.formatted).toFixed(2));
    }

    if (usdtData) {
      setUsdtBalance((Number(usdtData) / 1e18).toFixed(2));
    }
  }, [usdtData, bnbData]);


  useEffect(() => {
    if (error) {
      console.log('Transaction error:', error);
    }
  }, [error]);

  useEffect(() => {
    if (!userWallet) {
      navigate("/");
    }
  }, [navigate, userWallet]);

  const handleInvest = async () => {
    if (!selectedAmount) return;
  
    try {
      // Step 1: Approve USDT spending
      await writeContract({
        ...tokenAbi,
        address: '0x25ed48E0f7B9Be6024866A4eF4a3882333181517',
        functionName: 'approve',
        args: [userWallet, BigInt(selectedAmount * 1e18)],
      });
  
      // console.log("Approval transaction sent. Awaiting confirmation...");
  
      // Step 2: Make the deposit after approval
      await writeContract({
        ...contractAbi,
        address: '0x91B17e88cdDfCE018f7c3CFA0341aCcB26B57f23',
        functionName: 'deposit',
        args: [BigInt(selectedAmount * 1e18)],
      });
  
      // console.log("Deposit transaction completed.");
    } catch (error) {
      console.error("Investment failed:", error);
    }
  };
  

  const getButtonText = () => {
    if (isPending || isConfirming) return "Waiting for confirmation...";
    if (isConfirmed) return "Transaction confirmed!";
    return "Invest";
  }

  return (
    <div className="px-3 md:px-52 flex flex-col gap-10 py-10 md:py-20">
      <div className="border-secondary rounded-md border">
        <div className="bg-secondary text-white px-10 w-full py-3">
          <p className="text-2xl font-semibold">Subscriptions</p>
        </div>
        <div className="px-3">
          <p className="text-secondary opacity-60 text-center py-3 md:text-xl text-lg font-semibold">Grab a New Plan or Upgrade before slots are full</p>
          <div className="py-4 md:px-8 px-4 bg-light flex flex-wrap gap-3 rounded-md justify-evenly">
            {availableSub.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedAmount(item)}
                className={`${selectedAmount === item
                  ? 'bg-secondary text-white'
                  : 'bg-secondary bg-opacity-5'
                  } font-semibold md:text-lg text-base w-[75px] rounded-sm py-2`}
              >
                ${item}
              </button>
            ))}
          </div>
          <div className="py-10 flex flex-col gap-3">
            <div className="flex justify-between font-semibold text-lg">
              <p>USDT Balance:</p>
              <p>{usdtBalance}</p>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <p>BNB Balance:</p>
              <p>{bnbBalance}</p>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <p>Total USDT Invested:</p>
              <p>0</p>
            </div>
          </div>
          <button
            onClick={handleInvest}
            disabled={!selectedAmount || isPending || isConfirming}
            className={`flex justify-center w-full rounded-md py-2 bg-secondary text-white mb-5 text-lg font-semibold ${(!selectedAmount || isPending || isConfirming) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {getButtonText()}
          </button>
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
          <input type="text" className="w-full outline-none h-12 rounded-md px-3 border border-secondary" disabled />
          <button className="flex justify-center w-full md:w-fit px-8 rounded-md py-2 bg-secondary text-white mb-5 text-lg font-semibold">Copy</button>
        </div>
      </div>
    </div>
  )
}

export default Investment