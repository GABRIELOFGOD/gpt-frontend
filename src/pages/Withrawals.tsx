import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../components/context/GlobalContext";
import { useEffect } from "react";

const Withrawals = () => {
  const { userWallet } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if(!userWallet){
      navigate("/");
    }
  }, [navigate, userWallet]);
  return (
    <div className="px-3 md:px-52 flex flex-col gap-10 py-10 md:py-20">
      <div className="border-secondary rounded-md border">
        <div className="bg-secondary text-white px-10 w-full py-3">
          <p className="text-2xl font-semibold">Withdrawal History</p>
        </div>
        <div>
          <p className="text-light text-center py-3">No withdrawal yet</p>
        </div>
      </div>
    </div>
  )
}

export default Withrawals