import { useGlobalContext } from "../../components/context/GlobalContext";
import { useState } from "react";

export const truncateEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");
  if (!domain) return email;
  return `${localPart.slice(0, 3)}...@${domain}`;
};

const Withdrawal = () => {
  const [approvalLoading, setApprovalLoading] = useState(false);
  const { withdrawalsState, approveWithdrawal } = useGlobalContext();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Number of users to show per page
  
  // Calculate indices for slicing the user list
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = withdrawalsState.slice(indexOfFirstUser, indexOfLastUser);
  
  // Total pages
  const totalPages = Math.ceil(withdrawalsState.length / usersPerPage);
  
  // Handlers for pagination
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  
  const processWithdrawal = (id: number) => {
    setApprovalLoading(true);
    approveWithdrawal(id);
    setApprovalLoading(false);
  }

  
  return (
    <div>
      <p className="text-xl font-semibold">Withdrawals Requests</p>
      {!withdrawalsState.filter(withd => withd.status == "processing").length ? (
        <p className="text-center">No withdrawals request to show</p>
      ) : (
        <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">User wallet</th>
              <th className="py-2 px-4 border-b">Requested amount</th>
              {/* <th className="py-2 px-4 border-b">Total Investments</th> */}
              <th className="py-2 px-4 border-b hidden md:flex">User email</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.filter(withd => withd.status == "processing").map((user) => (
              <tr key={user.id} className="hover:bg-gray-100 text-xs">
                <td className="py-2 px-4 border-b">{user.user?.wallet}</td>
                <td className="py-2 px-4 border-b">{user.amount}</td>
                {/* <td className="py-2 px-4 border-b">
                  {Array.isArray(user.investments)
                    ? user.investments.reduce(
                        (amount, invest) => amount + (invest.amount || 0),
                        0
                      )
                    : 0}
                </td> */}
                <td className="py-2 px-4 border-b hidden md:flex">{truncateEmail(user.user?.email || "")}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className={`px-4 py-2 rounded bg-green-500 text-white disabled:opacity-50`}
                    onClick={() => processWithdrawal(user.id)}
                    disabled={approvalLoading}
                  >
                    {approvalLoading ? "Processing..." : "Approve"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>)
      }
    </div>
  );
}

export default Withdrawal