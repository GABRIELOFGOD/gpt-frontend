import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBalance, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { contractAbi } from "../../abi";
import { useGlobalContext } from "../components/context/GlobalContext";

import { tokenAbi } from "../../testabi";
import toast from "react-hot-toast";
import WithrawalModal from "../components/WithrawalModal";

const availableSub: number[] = [
  100, 300, 500, 1000, 3000, 5000, 10000, 25000, 50000, 100000
]

const Investment = () => {
  const { userWallet, userInvestment, userProfileState, claimEarnings } = useGlobalContext();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const [usdtBalance, setUsdtBalance] = useState<string>("0");
  const [bnbBalance, setbnbBalance] = useState<string>("0");
  const [confirmWithdraw, setConfirmWithdraw] = useState<boolean>(false);

  const [isApproved, setIsApproved] = useState(false);

  // Get USDT balance
  const { data: usdtData } = useReadContract({
    ...tokenAbi,
    address: '0x25ed48E0f7B9Be6024866A4eF4a3882333181517', // USDT contract address
    functionName: 'balanceOf',
    args: [userWallet as `0x${string}`],
  });

  // Get BNB balance
  const { data: bnbData } = useBalance({
    address: userWallet as `0x${string}`,
    chainId: 97,
  })

  const { isLoading: isConfirming } =
    useWaitForTransactionReceipt({
      hash,
    })
  useEffect(() => {
    // {userProfileState && console.log(userProfileState)}
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
      // navigate("/");
    }
  }, [navigate, userWallet]);

  const handleApprove = async () => {
    if (!selectedAmount) return;

    try {
      writeContract({
        ...tokenAbi,
        address: '0x25ed48E0f7B9Be6024866A4eF4a3882333181517',
        functionName: 'approve',
        args: ['0x91B17e88cdDfCE018f7c3CFA0341aCcB26B57f23', BigInt(selectedAmount * 1e18)],
      });

      setIsApproved(true);

    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const handleDeposit = async () => {
    if (!selectedAmount || !isApproved) return;

    try {
      writeContract({
        ...contractAbi,
        address: '0x91B17e88cdDfCE018f7c3CFA0341aCcB26B57f23',
        functionName: 'deposit',
        args: [BigInt(selectedAmount * 1e18)],
      });

      setSelectedAmount(0);
      setIsApproved(false);

      // todo add link backend here
      await userInvestment(selectedAmount);

    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(`https://gptbots.pro?ref=${userProfileState?.referralCode}`);
    toast.success("Referral link copied to clipboard");
  }

  const toggelConfirmWithdraw = () => {
    setConfirmWithdraw(!confirmWithdraw);
  }
  
  return (
    <div className="px-3 md:px-52 flex flex-col gap-10 py-10 md:py-20">
      <div className="fixed top-0 left-0 w-full h-screen -z-20">
        <img src="/images/bg.avif" className="h-full" alt="background image" />
      </div>
      <div className="flex gap-3 bg-light py-5">
        <img src="/static/8.png" className="w-[100px]" alt="GPTBOT" />
        <div className="flex flex-col gap-3">
          <p className="text-2xl text-secondary font-bold">Hello!, Welcome to GPTBOT</p>
        </div>
      </div>
      <div className="border-secondary rounded-md border">
        
        <div className="bg-secondary px-3 text-white w-full flex gap-3">
          <img src="/icons/1.gif" alt="Investment GIF" className="w-[50px] h-full" />
          <p className="text-2xl my-auto font-semibold">Subscriptions</p>
          <img src="/icons/2.gif" alt="Investment GIF" className="w-[50px] h-full" />
        </div>
        <div className="px-3 bg-white pb-5">
          <p className="text-secondary opacity-60 text-center py-3 md:text-xl text-lg font-semibold">Grab a New Plan or Upgrade before slots are full</p>
          <div className="py-4 md:px-8 px-4 bg-light flex flex-wrap gap-3 rounded-md justify-evenly">
          {/* {availableSub.map((item) => (
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
            ))} */}
            <select
              className="w-full bg-light outline-none"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(Number(e.target.value))}
            >
              {availableSub.map((sub, index) => (
                <option key={index} value={sub}>{sub}</option>
              ))}
            </select>
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
              <p>{userProfileState?.investments.reduce((total, investment) => total + investment.amount, 0)}</p>
            </div>
          </div>
          {!isApproved ? (
            <button
              onClick={handleApprove}
              disabled={!selectedAmount || isPending || isConfirming}
              className={`flex justify-center w-full rounded-md py-2 bg-secondary text-white text-lg font-semibold ${(!selectedAmount || isPending || isConfirming) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isPending || isConfirming ? "Approving..." : "Approve USDT"}
            </button>
          ) : (
            <button
              onClick={handleDeposit}
              disabled={isPending || isConfirming}
              className={`flex justify-center w-full rounded-md py-2 bg-secondary text-white text-lg font-semibold ${(isPending || isConfirming) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isPending || isConfirming ? "Depositing..." : "Deposit"}
            </button>
          )}
        </div>
      </div>

      {/* =================== WALLET ============================== */}
      <div className="border-secondary rounded-md border">
        <div className="bg-secondary flex gap-3 text-white px-3 w-full">
          <img src="/icons/3.gif" alt="Investment GIF" className="w-[50px] h-full" />
          <p className="text-2xl my-auto font-semibold">Wallet</p>
        </div>
        <div className="px-3 py-10 bg-white flex gap-3">
          <div className="flex-1">
            <div className=" flex flex-col bg-light p-2 rounded-md">
              <div className="flex gap-2">
                <img src="/static/2.png" className="w-[40px]" alt="coin icon" />
                <p className="font-bold text-3xl">USDT</p>
              </div>
              <div className="text-2xl text-center font-semibold">100 USDT</div>
            </div>
            <div className="flex w-full justify-center py-4">
              <button className="bg-green-700 text-white font-semibold text-lg rounded-full py-1 px-4">Withdraw</button>
            </div>
          </div>

          <div className="flex-1">
            <div className=" flex flex-col bg-light p-2 rounded-md">
              <div className="flex gap-2">
                <img src="/static/3.png" className="w-[40px]" alt="coin icon" />
                <p className="font-bold text-3xl">GPTCOIN</p>
              </div>
              <div className="text-2xl text-center font-semibold">100 GPT</div>
            </div>
            <div className="flex w-full justify-center py-4">
              <button className="bg-yellow-600 text-white font-semibold text-lg rounded-full py-1 px-4">Withdraw</button>
            </div>
          </div>

        </div>
      </div>

      <div className="flex gap-3 bg-secondary rounded-full w-full justify-center items-center py-3">
        <img src="/icons/4.gif" alt="Investment GIF" className="w-[50px] h-full" />
        <p className="text-2xl text-white my-auto font-semibold">GPT SWAP</p>
        <img src="/icons/2.gif" alt="Investment GIF" className="w-[50px] h-full" />
      </div>

      <div className="w-full p-3 bg-light rounded-md flex flex-col gap-5">
        <div className="flex gap-2">
          <img src="/icons/5.gif" alt="Investment GIF" className="w-[50px] h-full" />
          <p className="text-2xl my-auto font-semibold">Referral Link</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <input value={userProfileState && `https://gptbots.pro?ref=${userProfileState.referralCode}`} type="text" className="w-full text-center font-semibold outline-none h-12 rounded-md px-3 border border-secondary" disabled />
          <button onClick={copyToClipBoard} className="flex justify-center w-full md:w-fit px-8 rounded-md py-2 bg-secondary text-white mb-5 text-lg font-semibold">Copy</button>
        </div>
      </div>

      <div className="flex gap-3 bg-secondary rounded-full w-full justify-center items-center py-4">
        <img src="/icons/9.gif" alt="Investment GIF" className="w-[50px] h-full" />
        <div>
          <p className="text-2xl text-white my-auto font-semibold">GPT GAMES</p>
          <p className="text-2xl text-white my-auto font-semibold">PLAY TO EARN</p>
        </div>
        <img src="/icons/10.gif" alt="Investment GIF" className="w-[50px] h-full" />
      </div>

      <div className="border-secondary rounded-md border">
        <div className="bg-secondary text-white flex gap-2 px-5 w-full">
          <img src="/icons/6.gif" alt="Investment GIF" className="w-[50px] h-full" />
          <p className="text-2xl my-auto font-semibold">Earnings</p>
        </div>
        <div className="px-3 py-10 bg-white flex flex-col gap-3">
          <div className="bg-light text-secondary text-lg font-semibold rounded-md px-3 flex justify-between py-2">
            <p>Total Direct</p>
            <p>{userProfileState?.referredUsers?.length || 0}</p>
          </div>
          {/* <div className="bg-light text-secondary text-lg font-semibold rounded-md px-3 flex justify-between py-2">
            <p>Total Downlines</p>
            <p>{userProfileState?.referredUsers?.length +}</p>
          </div> */}
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

      <div className="border-secondary rounded-md border">
        <div className="bg-secondary text-white px-5 flex gap-2 w-full">
          <img src="/icons/7.gif" alt="Investment GIF" className="w-[50px] h-full" />
          <p className="text-2xl my-auto font-semibold">Earning claims</p>
        </div>
        <div className="px-3 py-10 bg-white flex flex-col gap-3">
          <div className="bg-light text-secondary text-lg font-semibold rounded-md px-3 flex justify-between py-2">
            <p>Total ROI Earned</p>
            <p>{userProfileState?.balance}</p>
          </div>
          <div className="bg-light text-secondary text-lg font-semibold rounded-md px-3 flex justify-between py-2">
            <p>Available to claim</p>
            <p>{userProfileState?.balance}</p>
          </div>
          <button
            onClick={toggelConfirmWithdraw}
            className={`flex justify-center w-full rounded-md py-2 bg-secondary text-white text-lg font-semibold`}
          >
            claim
          </button>
        </div>
      </div>

      <div className="border-secondary rounded-md border">
        <div className="bg-secondary text-white px-5 flex gap-2 w-full py-1">
          <img src="/icons/8.gif" alt="Investment GIF" className="w-[50px] h-full" />
          <p className="text-2xl my-auto font-semibold">Affliate Earning</p>
        </div>
        <div className="px-3 py-10 flex bg-white flex-col gap-3">
          <div className="bg-light text-secondary text-lg font-semibold rounded-md px-3 flex justify-between py-2">
            <p>Total Affliate Earn</p>
            <p>{userProfileState?.balance}</p>
          </div>
          <div className="bg-light text-secondary text-lg font-semibold rounded-md px-3 flex justify-between py-2">
            <p>Available to claim</p>
            <p>{userProfileState?.claimableRef}</p>
          </div>
          <button
            onClick={claimEarnings}
            className={`flex justify-center w-full rounded-md py-2 bg-secondary text-white text-lg font-semibold`}
          >
            Claim
          </button>
        </div>
      </div>

      
      {confirmWithdraw && <WithrawalModal close={toggelConfirmWithdraw} />}
    </div>
  )
}

export default Investment