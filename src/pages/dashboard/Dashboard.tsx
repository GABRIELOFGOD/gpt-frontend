import { useEffect } from "react"
import DashboardCard from "../../components/dashboard/DashboardCard"
import { useGlobalContext } from "../../components/context/GlobalContext";
import useInvestment from "../../hooks/InvestmentHook";

const Dashboard = () => {

  const { allUsersState, withdrawalHistoryState, withdrawalsState } =  useGlobalContext();
  const {  allInvestments, allUsersInvestments } = useInvestment();

  useEffect(() => {
    allInvestments();
  }, []);
  
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <DashboardCard name="Users" value={allUsersState.length} isMoney={false} />
        <DashboardCard name="Investments" value={allUsersInvestments.length} isMoney={false} />
        <DashboardCard name="Withdrawals Requests" value={withdrawalsState.length} isMoney={false} />
        <DashboardCard name="Total Invested" value={allUsersInvestments.reduce((price, value) => price+value.amount, 0)} isMoney />
        <DashboardCard name="Total Withdrawn" value={withdrawalHistoryState.reduce((value, withd) => value + withd.amount, 0)} isMoney />
      </div>
    </div>
  )
}

export default Dashboard