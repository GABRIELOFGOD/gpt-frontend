export interface User {
  id: number;
  wallet: string;
  createdAt: string;
  updatedAt: string;
  referralCode: string;
  balance: string;
  gptBalance: string;
  claimableROI: string;
  claimableRef: string;
  status: string;
  referredBy: User | null;
  investments: Investment[];
  withdrawalHistory: Withdrawal[];
  claims: Claims[];
  referredUsers: User[];
  name: string;
  email: string;
  phone: string;
}

export interface Investment {
  id: number;
  amount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Withdrawal {
  id: number;
  amount: number;
  status?: string;
  user?: User;
  createdAt: string;
  updatedAt?: string;
}

export interface Claims {
  id: number;
  amount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface EarningHistory {
  id: number;
  amountEarned: string;
  generationLevel: number;
  date: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  wallet: string;
  referralCode?: string;
}

export interface Token {
  name: string;
  image: string;
  rate: number;
}

export interface SwapData {
  amount: number;
  to: "USDT" | "GPT";
}

// {
//   "id": 1,
//   "amountEarned": "1.0000",
//   "generationLevel": 0,
//   "date": "2024-10-31T21:30:48.067Z"
// },