export interface NavLiistType {
  path: string;
  name: string;
}

export const navList: NavLiistType[] = [
  {
    path: "/investments",
    name: "Investments"
  },
  {
    path: "/referral-history",
    name: "Referrals"
  },
  {
    path: "/withdrawals",
    name: "Withdrawals"
  },
  {
    path: "/games",
    name: "Game"
  },
  {
    path: "/swap",
    name: "Swap"
  }
]