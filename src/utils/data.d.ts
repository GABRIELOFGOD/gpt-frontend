export interface User {
  id: number;
  wallet: string;
  createdAt: string;
  updatedAt: string;
  referralCode: string;
  balance: string;
  claimable: string;
  status: string;
  referredBy: User | null;
  investments: Investment[];
  withdrawalHistory: Withdrawal[];
  claims: Claims[];
  referredUsers: User[];
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


// {
//   "id": 1,
//   "amountEarned": "1.0000",
//   "generationLevel": 0,
//   "date": "2024-10-31T21:30:48.067Z"
// },