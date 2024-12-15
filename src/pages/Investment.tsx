import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAccount, useBalance, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { contractAbi } from "../../abi";
import { useGlobalContext } from "../components/context/GlobalContext";

import { tokenAbi } from "../../testabi";
import toast from "react-hot-toast";
import WithrawalModal from "../components/WithrawalModal";
import useInvestment from "../hooks/InvestmentHook";
// import useEarning from "../hooks/userHook";
import useClaim from "../hooks/ClaimHook";
import DoughnutChart from "../components/charts/Doughtnut";
import useEarning from "../hooks/userHook";
import { EarningHistory, User } from "../utils/data";
import useRegister from "../hooks/RegisterHook";
import useDownline from "../hooks/DownlineHook";
import { formatEther } from "viem";

const availableSub: number[] = [
  100, 300, 500, 1000, 3000, 5000, 10000, 25000, 50000, 100000
]

export const truncateWallet = (wallet: string): string => {
  if (!wallet) return "";
  return `${wallet.slice(0, 4)}****${wallet.slice(-4)}`;
};

export function gettingAllReferralsInvestment(referrals: User[]) {
  let total = 0;
  referrals.forEach((referral: any) => {
    total += referral?.investments.reduce((sum: number, investment: any) => sum + investment.amount, 0);
  });
  return total;
}

const Investment = () => {
  const { userWallet, userProfileState } = useGlobalContext();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const { data: hash, writeContractAsync, isPending, error, status } = useWriteContract()
  const [usdtBalance, setUsdtBalance] = useState<string>("0");
  const [bnbBalance, setbnbBalance] = useState<string>("0");
  const [confirmWithdraw, setConfirmWithdraw] = useState<boolean>(false);

  const [isApproved, setIsApproved] = useState<"first" | "second" | "none">("none");

  const { invest, error: investmentError, isLoading: isInvesting } = useInvestment();
  const { claimRef, claimRoi, isLoading: claimLoading, error: claimError } = useClaim()
  // const [hasDeposited, setHasDeposited] = useState<boolean>(false);

  const { isConnected, address } = useAccount();

  const { downline, userDownline } = useDownline();

  // const [isApproved, setIsApproved] = useState(false);

  // Get USDT balance
  // const { data: usdtData } = useReadContract({
  //   ...tokenAbi,
  //   address: '0x25ed48E0f7B9Be6024866A4eF4a3882333181517', // USDT contract address
  //   functionName: 'balanceOf',
  //   args: [userWallet as `0x${string}`],
  // });

  const { data: usdtData } = useReadContract({
    ...tokenAbi,
    address: '0x25ed48E0f7B9Be6024866A4eF4a3882333181517', // USDT contract address
    functionName: 'balanceOf',
    args: [userWallet],
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
    // Update BNB balance
    if (bnbData && bnbData.value) {
      setbnbBalance(formatEther(bnbData.value)); // Convert BigNumber to readable string
    }
    setUsdtBalance("0");
  }, [bnbData, usdtData]);


  useEffect(() => {
    if (error) {
      //  ('Transaction error:', error);
    }
  }, [error]);

  useEffect(() => {
    if (!userWallet) {
      // navigate("/");
    }
  }, [navigate, userWallet]);

  const { checkWallet } = useRegister();

  async function handleDeposit() {
  if (!selectedAmount) return;

  // =============== CHECK WALLET ================== //
  const wallet = address as string;
  const walletResponse = await checkWallet(wallet);
  if (!walletResponse.user || walletResponse.user.wallet !== userProfileState?.wallet) {
    toast.dismiss();
    toast.error("Sorry!, you can only invest with the registered wallet");
    return;
  }

  if (isApproved == "none") {
    try {
      const approved = await writeContractAsync({
        ...tokenAbi,
        address: '0x25ed48E0f7B9Be6024866A4eF4a3882333181517',
        functionName: 'approve',
        args: ['0x91B17e88cdDfCE018f7c3CFA0341aCcB26B57f23', BigInt(selectedAmount * 1e18)],
      });
      console.log(approved);
      toast.success("Approved successfully, click on the button again to trigger deposit");
      setIsApproved("first");
    } catch (error) {
      toast.error("Failed to approve deposit");
      
    }
  }
}

const signDeposit = async () => {
  try {
    const deposit = await writeContractAsync({
      ...contractAbi,
      address: '0x91B17e88cdDfCE018f7c3CFA0341aCcB26B57f23',
      functionName: 'deposit',
      args: [BigInt(selectedAmount * 1e18)],
    });
    console.log(deposit);
    setIsApproved("second");
  } catch (error) {
    toast.error("Failed to deposit");
  }
}

// useEffect(() => {
//   if (isApproved === "first") {
//     signDeposit();
//   }
// }, [status, isApproved]);

useEffect(() => {
  userDownline();
  console.log(downline);
}, []);

const runBackendDeposit = async () => {
  const wallet = address as string;
  const investmentResponse = await invest(selectedAmount, wallet);
  if (investmentResponse.status && investmentResponse.status === "fail") {
    return toast.error(investmentResponse.message);
  } else {
    toast.success(investmentResponse.message);
    location.reload();
  }
}

useEffect(() => {
  if (isApproved === "second") {
    runBackendDeposit();
  }
},[status, isApproved]);

  const { userEarnings } = useEarning();
  // const [allEarnings, setAllEarnings] = useState<EarningHistory[]>([]);
  const [totalROI, setTotalROI] = useState<number>(0);
  const [totalReferral, setTotalReferral] = useState<number>(0);

  const fetchEarnings = async () => {
    try {
      const response = await userEarnings();
  
      // Filter earnings into ROI and referral
      const roi = response.filter(
        (earning: EarningHistory) => earning.generationLevel === 0
      );
      const ref = response.filter(
        (earning: EarningHistory) => earning.generationLevel > 0
      );
  
      // Calculate totals, using parseFloat to correctly handle decimal values
      const totalRoiAmount = roi.reduce(
        (total: number, earning: EarningHistory) => total + parseFloat(earning.amountEarned || "0"),
        0
      );
      const totalReferralAmount = ref.reduce(
        (total: number, earning: EarningHistory) => total + parseFloat(earning.amountEarned || "0"),
        0
      );
  
      // Update state
      setTotalROI(totalRoiAmount);
      setTotalReferral(totalReferralAmount);
      // setAllEarnings(response);
    } catch (error) {
      console.error("Failed to fetch earnings:", error);
      // Optionally, show error feedback in the UI
    }
  };
  
  useEffect(() => {
    fetchEarnings();
  }, []);
  

  if(claimError) {
    //  ('Claim error:', claimError);
    toast.error(claimError);
  }

  if (investmentError) {
    //  ('Investment error:', investmentError);
    toast.error(investmentError);
  }

  const claimRoiEarning = async () => {
    try {
      const roiRes = await claimRoi();
       (roiRes);
      if(roiRes.status && roiRes.status === "fail") {
        toast.error(roiRes.message);
      } else {
        toast.success(roiRes.message);
        location.reload();
      }
    } catch (error) {
      toast.error("Failed to claim ROI earnings");
    }
  }

  const claimRefEarnings = async () => {
    try {
      const refRes = await claimRef();
       (refRes);
      if(refRes.status && refRes.status === "fail") {
        toast.error(refRes.message);
      } else {
        toast.success(refRes.message);
        location.reload();
      }
    } catch (error) {
      toast.error("Failed to claim Referral earnings");
    }
  }  

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(`https://app.gptbots.pro/investments?ref=${userProfileState?.referralCode}`);
    toast.success("Referral link copied to clipboard");
  }

  const toggelConfirmWithdraw = () => {
    setConfirmWithdraw(!confirmWithdraw);
  }

  const toTwoDecimalPlaces = (num: number): string => {
    return num.toFixed(2);
  };

  const totalEarningToPercentage = (total: number, earning: number): number => {
    return (earning / total) * 100;
  }
  
  return (
    <div className="px-3 md:px-52 flex flex-col gap-10 py-10 md:py-20">
      <div className="fixed top-0 left-0 w-full h-screen -z-20">
        <img src="/images/bg.avif" className="h-full w-full" alt="background image" />
      </div>
      <div className="flex gap-3 bg-light py-5">
        {!isConnected ? <img src="/icons/Wallet Not Connected.gif" className="w-[120px]" alt="GPTBOT" /> : <img src="/icons/wallet connected.gif" className="w-[120px]" alt="GPTBOT" />}
        <div className="flex flex-col gap-3">
          <p className="md:text-2xl text-lg text-secondary font-bold">Hello!, Welcome to GPTBOT</p>
          <p className="text-xs font-semibold">Name: <span>{userProfileState?.name}</span></p>
          <p className="text-xs font-semibold">Phone: <span>{userProfileState?.phone}</span></p>
          <p className="text-xs font-semibold">Email: <span>{userProfileState?.email}</span></p>
          <p className="text-xs font-semibold hidden md:flex">Wallet: <span>{userProfileState?.wallet}</span></p>
          <p className="text-xs font-semibold flex md:hidden">Wallet: <span>{truncateWallet(userProfileState?.wallet || "")}</span></p>
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
              <option className="text-neutral-200 cursor-not-allowed" value="">-- SELECT AN AMOUNT TO INVEST --</option>
              {availableSub.map((sub, index) => (
                <option key={index} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
          <div className="py-10 flex flex-col gap-3">
            {/* <div className="flex justify-between font-semibold text-lg">
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
            </div> */}

            <div className="flex font-semibold justify-between">
              <p>Account status</p>
              {userProfileState?.hasActiveInvestment ? <p className="text-green-500">Active</p> : <p className="text-red-500">Inactive</p>}
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <div className="my-auto flex flex-col gap-2">
                <div>
                  <p>Total USDT Invested:</p>
                  <p className="text-sm text-secondary ">{userProfileState?.investments.reduce((total, investment) => total + investment.amount, 0)}</p>
                </div>
                <div>
                  <p>Total Earning</p>
                  <p className="text-sm text-secondary ">{(totalROI+totalReferral).toFixed(4)}</p>
                
                </div>
                <div>
                  <p>Ceiling limit (3x)</p>
                  <p className="text-sm text-secondary ">{userProfileState?.investments && userProfileState?.investments.reduce((total, investment) => total + investment.amount, 0) * 3}</p>
                </div>
              </div>

              <div className="h-[100px]">
                <DoughnutChart
                  color="blue"
                  percentage={totalEarningToPercentage(userProfileState?.investments.reduce((total, investment) => total + investment.amount, 0)! * 3, totalROI+totalReferral)}
                  // total={totalEarningToPercentage(totalROI)}
                  completeLabel="Total ROI"
                  remainingLabel="Ceiling limit"
                />
              </div>
              
            </div>
            <div className="pt-5">
              <div className="flex justify-between font-semibold text-lg">
                <p>USDT Balance:</p>
                <p>{usdtBalance}</p>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <p>BNB Balance:</p>
                <p>{bnbBalance}</p>
              </div>
            </div>
            
          </div>
          { !isConnected ? <button className="w-full text-neutral-300 bg-lime-50 py-2 rounded-md">Connect wallet to invests</button>
          : <button
            className={`flex justify-center w-full rounded-md py-2 bg-secondary text-white text-lg font-semibold ${(!selectedAmount || isPending || isConfirming || isInvesting) ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={isApproved === "first" ? signDeposit : handleDeposit}
          >
            {isPending || isConfirming || isInvesting ? "Processing..." : isApproved === "first" ? `invest ${selectedAmount} USDT` : `Approve ${selectedAmount} USDT`}
          </button>}
            {/* }: !isApproved ? <button
            onClick={handleApprove}
            disabled={!selectedAmount || isPending || isConfirming || isInvesting}
            className={`flex justify-center w-full rounded-md py-2 bg-secondary text-white text-lg font-semibold ${(!selectedAmount || isPending || isConfirming || isInvesting) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPending || isConfirming || isInvesting ? "Approving..." : "Approve Deposit"}
          </button> :
          <button
            onClick={handleDeposit}
            disabled={!selectedAmount || isPending || isConfirming || isInvesting}
            className={`flex justify-center w-full rounded-md py-2 bg-secondary text-white text-lg font-semibold ${(!selectedAmount || isPending || isConfirming || isInvesting) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPending || isConfirming || isInvesting ? "Investing..." : "Invest USDT"}
          </button>
          } */}
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
              <div className="flex gap-2 pt-5 w-full justify-center">
                <img src="/static/2.png" className="w-[40px]" alt="coin icon" />
                <p className="font-bold md:text-3xl text-2xl">USDT</p>
              </div>
              <div className="md:text-2xl py-5 text-center font-semibold">{toTwoDecimalPlaces(parseFloat(userProfileState?.balance  || "0"))} USDT</div>
            </div>
            <div className="flex w-full justify-center py-4">
              <button className="bg-green-700 text-white font-semibold text-lg rounded-full py-1 px-4">Withdraw</button>
            </div>
          </div>

          <div className="flex-1">
            <div className=" flex flex-col bg-light p-2 rounded-md">
              <div className="flex gap-2 pt-5 w-full justify-center">
                <img src="/static/3.png" className="w-[40px]" alt="coin icon" />
                <p className="font-bold md:text-3xl text-2xl">GPTCOIN</p>
              </div>
              <div className="md:text-2xl py-5 text-center font-semibold">{toTwoDecimalPlaces(parseFloat(userProfileState?.gptBalance  || "0"))} GPT</div>
            </div>
            <div className="flex w-full justify-center py-4">
              <button className="bg-yellow-600 text-white font-semibold text-lg rounded-full py-1 px-4">Withdraw</button>
            </div>
          </div>

        </div>
      </div>

      <Link to="/swap" className="flex gap-3 bg-secondary rounded-full w-full justify-center items-center py-3">
        <img src="/icons/4.gif" alt="Investment GIF" className="w-[50px] h-full" />
        <p className="text-2xl text-white my-auto font-semibold">GPT SWAP</p>
        <img src="/icons/2.gif" alt="Investment GIF" className="w-[50px] h-full" />
      </Link>

      <div className="w-full p-3 bg-light rounded-md flex flex-col gap-5">
        <div className="flex gap-2">
          <img src="/icons/5.gif" alt="Investment GIF" className="w-[50px] h-full" />
          <p className="text-2xl my-auto font-semibold">Referral Link</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <input value={userProfileState && `https://app.gptbots.pro/investments?ref=${userProfileState.referralCode}`} type="text" className="w-full text-center font-semibold outline-none h-12 rounded-md px-3 border border-secondary" disabled />
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
            <p>Total Team</p>
            <p>
              { downline && downline.length }
            </p>
          </div>
          <div className="bg-light text-secondary text-lg font-semibold rounded-md px-3 flex justify-between py-2">
            <p>Direct Volume</p>
            <p>{userProfileState?.referredUsers && gettingAllReferralsInvestment(userProfileState?.referredUsers)}</p>
          </div>
          <div className="bg-light text-secondary text-lg font-semibold rounded-md px-3 flex justify-between py-2">
            <p>Team Volume</p>
            <p>
              {downline && downline.reduce((total, down) => total + down.investments.reduce((sum, investment) => sum + investment.amount, 0), 0)}
            </p>
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
            <p>{totalROI.toFixed(4)} <span className="text-xs">USDT</span></p>
          </div>
          <div className="bg-light text-secondary text-lg font-semibold rounded-md px-3 flex justify-between py-2">
            <p>Available to claim</p>
            <p>{userProfileState?.claimableROI} <span className="text-xs">USDT</span></p>
          </div>
          <button
            onClick={claimRoiEarning}
            className={`flex justify-center w-full rounded-md py-2 bg-secondary text-white text-lg font-semibold ${claimLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {claimLoading ? "Claiming..." : "Claim"}
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
            <p>{totalReferral.toFixed(4)} <span className="text-xs">USDT</span></p>
          </div>
          <div className="bg-light text-secondary text-lg font-semibold rounded-md px-3 flex justify-between py-2">
            <p>Available to claim</p>
            <p>{userProfileState?.claimableRef} <span className="text-xs">USDT</span></p>
          </div>
          <button
            onClick={claimRefEarnings}
            className={`flex justify-center w-full rounded-md py-2 bg-secondary text-white text-lg font-semibold ${claimLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {claimLoading ? "Claiming..." : "Claim"}
          </button>
        </div>
      </div>

      
      {confirmWithdraw && <WithrawalModal close={toggelConfirmWithdraw} />}
    </div>
  )
}

export default Investment