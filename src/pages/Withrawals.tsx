import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context/GlobalContext";
import { useEffect, useState } from "react";
import WithdrawalModal from "../components/WithrawalModal";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Withrawals = () => {
  const { userWallet, withdrawalHistory, withdrawalHistoryState, earningHistory, earningHistoryState } = useGlobalContext();
  const navigate = useNavigate();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < earningHistoryState.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const closeModal = () => {
    setIsWithdrawalModalOpen(!isWithdrawalModalOpen);
  }

  const dateFormatter = (date: string) => {
    const newDate = new Date(date);
    return newDate.toDateString();
  }

  useEffect(() => {
    withdrawalHistory();
    earningHistory();
    // getUserDownlines();
    if(!userWallet){
      // navigate("/");
    }
  }, [navigate, userWallet]);
  return (
    <div className="px-3 md:px-52 flex flex-col gap-10 py-10 md:py-20">
      <div className="border-secondary rounded-md border">
        <div className="bg-secondary text-white px-10 w-full py-3">
          <p className="text-2xl font-semibold">Withdrawal History</p>
        </div>
        <div className="py-5 px-3">
          {!withdrawalHistoryState || withdrawalHistoryState?.length <= 0 ?
            <div>
              <p className="text-light text-center py-3">No withdrawal yet</p>
            </div> : 
            <table className="min-w-full divide-y divide-secondary py-5">
              <thead className="bg-secondary">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary">
                {withdrawalHistoryState?.map((withdrawal, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                      {withdrawal.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[8px] text-secondary">
                      {dateFormatter(withdrawal.createdAt)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${withdrawal.status == "processing" ? "text-yellow-500" : "text-green-500"} `}>
                      {withdrawal.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
          {/* <button
            className={`flex justify-center w-full rounded-md bg-secondary py-2 text-white text-lg font-semibold`}
            onClick={closeModal}
          >
            Withdraw
          </button> */}
        </div>
      </div>
      {isWithdrawalModalOpen ? <WithdrawalModal close={closeModal} /> : ""}
      <div className="border-secondary rounded-md border">
        <div className="bg-secondary text-white px-10 w-full py-3">
          <p className="text-2xl font-semibold">Earning History</p>
        </div>
        <div className="py-5 px-3">
          {!earningHistoryState || earningHistoryState?.length <= 0 ?
            <div>
              <p className="text-light text-center py-3">Nothing earned yet</p>
            </div> : 
            <table className="min-w-full divide-y divide-secondary py-5">
              <thead className="bg-secondary">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
                <tbody className="bg-white divide-y divide-secondary">
                {earningHistoryState?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((withdrawal, index) => (
                  <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                    {withdrawal.amountEarned}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                    {withdrawal.generationLevel == 0 ? "ROI" : `Level ${withdrawal.generationLevel}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                    {dateFormatter(withdrawal.date)}
                  </td>
                  </tr>
                ))}
                </tbody>
            </table>
          }
          {/* <button
            className={`flex justify-center w-full rounded-md bg-secondary py-2 text-white text-lg font-semibold`}
            onClick={closeModal}
          >
            Withdraw
          </button> */}
        </div>
        <div className="flex gap-2 justify-end px-3 py-2">
          <button
            className={`flex justify-center w-fit px-6 rounded-md bg-secondary py-2 text-white text-lg font-semibold ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            <IoIosArrowBack />
          </button>
          <button
            className={`flex justify-center w-fit px-6 rounded-md bg-secondary py-2 text-white text-lg font-semibold ${(currentPage + 1) * itemsPerPage >= earningHistoryState.length ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNextPage}
            disabled={(currentPage + 1) * itemsPerPage >= earningHistoryState.length}
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>
      {/* <div className="border-secondary rounded-md border">
        <div className="bg-secondary text-white px-10 w-full py-3">
          <p className="text-2xl font-semibold">Referral History</p>
        </div>
        <div className="py-5 px-3">
          {!withdrawalHistoryState || withdrawalHistoryState?.length <= 0 ?
            <div>
              <p className="text-light text-center py-3">No referrals yet</p>
            </div> : 
            <table className="min-w-full divide-y divide-secondary py-5">
              <thead className="bg-secondary">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Wallet Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Investments
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary">
                {downlines?.map((withdrawal, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                      {withdrawal.wallet}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                      {withdrawal.investments.reduce((acc, curr) => acc + curr.amount, 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                      {withdrawal.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
          <button
            className={`flex justify-center w-full rounded-md bg-secondary py-2 text-white text-lg font-semibold`}
            onClick={closeModal}
          >
            Withdraw
          </button>
        </div>
      </div> */}
    </div>
  )
}

export default Withrawals


{/* <tbody className="bg-white divide-y divide-secondary">
                {earningHistoryState?.slice(0, 25).map((withdrawal, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                      {withdrawal.amountEarned}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                      {withdrawal.generationLevel == 0 ? "ROI" : `Level ${withdrawal.generationLevel}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                      {dateFormatter(withdrawal.date)}
                    </td>
                  </tr>
                ))}
              </tbody> */}