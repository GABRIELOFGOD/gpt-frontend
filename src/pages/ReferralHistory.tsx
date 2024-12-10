// import { useNavigate } from "react-router-dom";
// import { useGlobalContext } from "../components/context/GlobalContext";
import { useEffect, useState } from "react";
import useDownline from "../hooks/DownlineHook";
import toast from "react-hot-toast";
import { Downlines } from "../utils/data";
import { truncateWallet } from "./Investment";

const ReferralHistory = () => {
  const [level, setLevel] = useState<number>(1);
  const [downlines, setDownline] = useState<Downlines[]>([]);
  // const { userProfileState } = useGlobalContext();
  const { userDownline, downline, isLoading, error } = useDownline();
  
  // const navigate = useNavigate();

  useEffect(() => {
    userDownline();
  }, []);

  if (error) {
    toast.error(error);
     (error);
  }

  const setDownlineWithLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // console.log(downline);
    setLevel(parseInt(e.target.value));
    setDownline(downline?.filter((downline) => downline.level === parseInt(e.target.value)));
  }
  
  useEffect(() => {
    setDownline(downline.filter((downline) => downline.level === level));
  }, [downline]);

  const obfuscateEmail = (email: string): string => {
    const [localPart, domain] = email.split("@");
    const obfuscatedLocalPart = `${localPart.slice(0, 3)}****${localPart.slice(-3)}`;
    return `${obfuscatedLocalPart}@${domain}`;
  };
  
   (downlines);
  return (
    <div className="px-3 md:px-52 flex flex-col gap-10 py-10 md:py-20">
      <div className="border-secondary rounded-md border">
        <div className="bg-secondary text-white flex justify-between md:px-10 px-3 w-full py-3">
          <p className="text-2xl font-semibold">Referral History</p>
          <select
            className="bg-secondary text-white border border-white outline-none rounded-md px-3 py-1"
            name="pagination"
            id="pagination"
            value={level}
            onChange={setDownlineWithLevel}
          >
            {Array.from({ length: 20 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        {isLoading ? <p className="w-full text-center">Loading...</p> : !downlines || downlines.length < 1 ?
          <div>
            <p className="text-light text-center py-3">You have no referral in this level</p>
          </div> :
            <table className="min-w-full divide-y divide-secondary">
            <thead className="bg-secondary">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Wallet
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Investments
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary">
              {downlines.map((referral, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-[8px] md:text-sm">
                    {obfuscateEmail(referral.email)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[8px] md:text-sm">
                    {truncateWallet(referral.wallet)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {referral.investments ? referral.investments.reduce((acc, investment) => acc + investment.amount, 0) : 0}
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