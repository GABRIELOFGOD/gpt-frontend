import { useEffect, useState } from "react";
import { useGlobalContext } from "../components/context/GlobalContext";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Admin = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [approvalLoading, setApprovalLoading] = useState(false);
  // const [confirmWithdrawal, setConfirmWithdrawal] = useState(false);

  // const closeModal = () => {
  //   setConfirmWithdrawal(!confirmWithdrawal);
  // };
  
  const itemsPerPage = 10;

  const { allUsersState, allUsers, withdrawalsForAdmin, withdrawalsState, approveWithdrawal } = useGlobalContext();
  
  useEffect(() => {
    allUsers();
    withdrawalsForAdmin();
  }, []);
  
  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < allUsersState.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const dateFormatter = (date: string) => {
    const newDate = new Date(date);
    return newDate.toDateString();
  }

  const formatWallet = (wallet: string) => {
    if (wallet.length <= 8) return wallet;
    return `${wallet.slice(0, 4)}******${wallet.slice(-4)}`;
  };

  const processWithdrawal = (id: number) => {
    setApprovalLoading(true);
    approveWithdrawal(id);
    setApprovalLoading(false);
  }

  return (
    <div className="px-3 py-5">
      <p className="text-2xl font-bold pb-5">Welcome Admin</p>
      <div className="border-secondary rounded-md border mb-5">
        <div className="bg-secondary text-white px-10 w-full py-3">
          <p className="text-2xl font-semibold">All Withrawals</p>
        </div>
        <div className="py-5 px-3">
          {!allUsersState || allUsersState?.length <= 0 ?
            <div>
              <p className="text-light text-center py-3">No withdrawal yet</p>
            </div> : 
            <table className="min-w-full divide-y divide-secondary py-5">
              <thead className="bg-secondary">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    amount
                  </th>
                  {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Date
                  </th> */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
                <tbody className="bg-white divide-y divide-secondary">
                {withdrawalsState?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((withdrawal, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-[10px semi-bold] whitespace-nowrap text-secondary">
                      {formatWallet(withdrawal.user?.wallet as string)}
                    </td>
                    <td className="px-6 py-4 text-[10px] semi-bold whitespace-nowrap text-secondary">
                      {withdrawal.amount}
                    </td>
                    {/* <td className="px-6 py-4 text-[10px] semi-bold whitespace-nowrap text-sm text-secondary">
                      {dateFormatter(withdrawal.createdAt)}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                      {withdrawal.status == "processing" ? <div>
                        {
                            approvalLoading ? <p className="text-[10px]">Processing...</p> : <button
                            className={`text-[10px] semi-bold text-green-500`}
                            onClick={() => processWithdrawal(withdrawal.id)}
                          >
                            Approve
                          </button>
                        }
                      </div> : <p className="text-[10px]">Completed</p>}
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
            className={`flex justify-center w-fit px-6 rounded-md bg-secondary py-2 text-white text-lg font-semibold ${(currentPage + 1) * itemsPerPage >= allUsersState.length ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNextPage}
            disabled={(currentPage + 1) * itemsPerPage >= allUsersState.length}
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>
      <div className="border-secondary rounded-md border">
        <div className="bg-secondary text-white px-10 w-full py-3">
          <p className="text-2xl font-semibold">All users</p>
        </div>
        <div className="py-5 px-3">
          {!allUsersState || allUsersState?.length <= 0 ?
            <div>
              <p className="text-light text-center py-3">Users yet</p>
            </div> : 
            <table className="min-w-full divide-y divide-secondary py-5">
              <thead className="bg-secondary">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Wallet
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Date Registered
                  </th>
                </tr>
              </thead>
                <tbody className="bg-white divide-y divide-secondary">
                {allUsersState?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((withdrawal, index) => (
                  <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                    {formatWallet(withdrawal.wallet)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                    {dateFormatter(withdrawal.createdAt)}
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
            className={`flex justify-center w-fit px-6 rounded-md bg-secondary py-2 text-white text-lg font-semibold ${(currentPage + 1) * itemsPerPage >= allUsersState.length ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNextPage}
            disabled={(currentPage + 1) * itemsPerPage >= allUsersState.length}
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Admin