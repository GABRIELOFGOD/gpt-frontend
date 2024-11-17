import { createContext, ReactNode, useContext, useState } from "react";
import toast from "react-hot-toast";
import { EarningHistory, User, Withdrawal } from "../../utils/data";


interface GlobalContextType {
  userWallet: string;
  setUserWallet: (wallet: string) => void;
  userLogin: (wallet: string, ref?: string) => void;
  userInvestment: (amount: number) => void;
  withdrawalHistory: () => void;
  withdrawalHistoryState: Withdrawal[];
  userProfile: () => void;
  userProfileState: User | undefined;
  claimEarnings: () => void;
  userWithdrawal: (amount: number) => void;
  earningHistory: () => void;
  earningHistoryState: EarningHistory[];
  getUserDownlines: () => void;
  downlines: User[];
}

const GlobalContext = createContext<GlobalContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const CreateGlobalContext = ({ children }: Props) => {
  const BASEURL = "http://localhost:8000/api/v1";
  // const BASEURL = "https://api.gptbots.pro/api/v1";
  const [userWallet, setUserWallet] = useState<string>("");
  const [withdrawalHistoryState, setWithdrawalHistory] = useState<Withdrawal[]>([]);
  const [userProfileState, setUserProfile] = useState<User>();
  const [earningHistoryState, setEarningHistory] = useState<EarningHistory[]>([]);
  const [downlines, setDownlines] = useState<User[]>([]);
  // const userWallet: string = "0x7b49660dc6F25326d2fA7C3CD67970dF73eB5Ec1";

  const userInvestment = async (amount: number) => {
    console.log(localStorage.getItem("user"));
    const request = await fetch(`${BASEURL}/investment/invest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`,
      },
      body: JSON.stringify({ amount }),
    });
    const response = await request.json();
    // console.log(response);
    if(!request.ok) {
      toast.error(response.message);
    }
    if(request.ok) {
      // 
    }
  }

  const userLogin = async (wallet: string, ref?: string) => {
    const request = await fetch(`${BASEURL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: ref ? JSON.stringify({ wallet, ref }) : JSON.stringify({ wallet }),
    });
    const response = await request.json();
    // console.log(response);
    if(request.ok) {
      localStorage.setItem("user", JSON.stringify(response.token));
    }
  }

  const withdrawalHistory = async () => {
    const request = await fetch(`${BASEURL}/user/withdrawal/history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`,
      },  
    });
    const response = await request.json();
    console.log(response);
    if(!request.ok) {
      toast.error(response.message);
    }
    if(request.ok) {
      setWithdrawalHistory(response.data);
    }
  }

  // ========================= USER PROFILE ========================= //
  const userProfile = async () => {
    const request = await fetch(`${BASEURL}/user/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application",
        "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`,
      },
    });
    const response = await request.json();
    console.log(response);
    if(!request.ok) {
      toast.error(response.message);
    }
    if(request.ok) {
      setUserProfile(response.user);
    }
  }


  // ========================= USER EARNINGS ============================= //

  const claimEarnings = async () => {
    const request = await fetch(`${BASEURL}/investment/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`,
      },
    });
    const response = await request.json();
    console.log(response);
    if(!request.ok) {
      toast.error(response.message);
    }
    if(request.ok) {
      toast.success(response.message);
      location.reload();
    }
  }

  // =============== USER WITHDRAWAL ================== //
  const userWithdrawal = async (amount: number) => {
    const request = await fetch(`${BASEURL}/user/withdrawal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`,
      },
      body: JSON.stringify({ amount }),
    });
    const response = await request.json();
    console.log(response);
    if(!request.ok) {
      toast.error(response.message);
    }
    if(request.ok) {
      toast.success(response.message);
    }
  }

  // ================ EARNING HISTORY ==================== //
  const earningHistory = async () => {
    const request = await fetch(`${BASEURL}/user/history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`,
      },
    });
    const response = await request.json();
    console.log(response);
    if(!request.ok) {
      toast.error(response.message);
    }
    if(request.ok) {
      setEarningHistory(response?.history);
    }
  }
  
  // ========================= USER EARNINGS ============================= //

  // ========================== USER ============================== //
  const getUserDownlines = async () => {
    const request = await fetch(`${BASEURL}/user/downlines`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`,
      },
    });
    const response = await request.json();
    console.log(response);
    if(!request.ok) {
      toast.error(response.message);
    }
    if(request.ok) {
      setDownlines(response.referrals);
    }
    
  }


  return (
    <GlobalContext.Provider value={{
        userWallet,
        setUserWallet,
        userLogin,
        userInvestment,
        withdrawalHistory,
        withdrawalHistoryState,
        userProfile,
        userProfileState,
        claimEarnings,
        userWithdrawal,
        earningHistory,
        earningHistoryState,
        getUserDownlines,
        downlines,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a CreateGlobalContext");
  }
  return context;
};
