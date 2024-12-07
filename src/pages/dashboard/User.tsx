import { useState } from "react";
import { BASEURL, useGlobalContext } from "../../components/context/GlobalContext";
import toast from "react-hot-toast";

const User = () => {
  const { allUsersState } = useGlobalContext();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Number of users to show per page
  
  // Calculate indices for slicing the user list
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = allUsersState.slice(indexOfFirstUser, indexOfLastUser);
  
  // Total pages
  const totalPages = Math.ceil(allUsersState.length / usersPerPage);
  
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
  
  const handleBlockUnblock = async (userId: number) => {
    try {
      const request = await fetch(`${BASEURL}/user/block`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`
        },
        body: JSON.stringify({ userId }),
      });
      const response = await request.json();
      if (!request.ok) {
        throw new Error(response.message || "An error occurred");
      }
      toast.success(response.message);
      location.reload();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const truncateEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (!domain) return email;
    return `${localPart.slice(0, 3)}...@${domain}`;
  };
  
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              {/* <th className="py-2 px-4 border-b">Total Investments</th> */}
              <th className="py-2 px-4 border-b hidden md:flex">Wallet</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100 text-xs">
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{truncateEmail(user.email)}</td>
                {/* <td className="py-2 px-4 border-b">
                  {Array.isArray(user.investments)
                    ? user.investments.reduce(
                        (amount, invest) => amount + (invest.amount || 0),
                        0
                      )
                    : 0}
                </td> */}
                <td className="py-2 px-4 border-b hidden md:flex">{user.wallet}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className={`px-4 py-2 rounded ${
                      user.status === "blocked"
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                    onClick={() => handleBlockUnblock(user.id)}
                  >
                    {user.status === "blocked" ? "Unblock" : "Block"}
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
      </div>
    </div>
  );
};

export default User;
