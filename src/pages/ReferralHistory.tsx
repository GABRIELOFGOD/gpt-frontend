import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context/GlobalContext";
import { useEffect } from "react";

const ReferralHistory = () => {
  const { userWallet, userProfileState } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if(!userWallet){
      // navigate("/");
    }
  }, [navigate, userWallet]);
  return (
    <div className="px-3 md:px-52 flex flex-col gap-10 py-10 md:py-20">
      <div className="border-secondary rounded-md border">
        <div className="bg-secondary text-white px-10 w-full py-3">
          <p className="text-2xl font-semibold">Referral History</p>
        </div>
        {!userProfileState?.referredUsers.length || userProfileState.referredUsers.length > 0 ?
          <div>
            <p className="text-light text-center py-3">No Referrals yet</p>
          </div> :
            <table className="min-w-full divide-y divide-secondary">
            <thead className="bg-secondary">
              <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Wallet
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Investments
              </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary">
              {userProfileState?.referredUsers.map((referral, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-light">
                {referral.wallet}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-light">
                {referral.investments.reduce((acc, investment) => acc + investment.amount, 0)}
                </td>
              </tr>
              ))}
            </tbody>
            </table>
        }
      </div>
    </div>
  )
}

export default ReferralHistory