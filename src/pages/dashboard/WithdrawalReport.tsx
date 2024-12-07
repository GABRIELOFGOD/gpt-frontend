// import useWithdrawal from "../../hooks/useWithdrawal"

import { useGlobalContext } from "../../components/context/GlobalContext"
import { truncateEmail } from "./Withdrawal";

const WithdrawalReport = () => {

  // const { error, fetchWithdrawals, loading, withdrawals } = useWithdrawal();
  const { withdrawalsState } = useGlobalContext();
  
  return (
    <div>
      <p className="text-xl font-semibold">All Withdrawals</p>
      {!withdrawalsState || !withdrawalsState.length ?
      <div className="flex justify-center items-center">
        <p className="text-center">No withdrawals request to show</p>
      </div> :
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          User Email
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Amount
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Wallet
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {withdrawalsState.map((withdrawal) => (
        <tr key={withdrawal.id}>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{truncateEmail(withdrawal.user?.email || "")}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{withdrawal.amount}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{withdrawal.user?.wallet}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{withdrawal.status}</td>
        </tr>
          ))}
        </tbody>
      </table>}
    </div>
  )
}

export default WithdrawalReport