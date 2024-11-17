import { CgClose } from "react-icons/cg";
import { useGlobalContext } from "./context/GlobalContext";
import { useState } from "react";

const WithrawalModal = ({ close }: {close: () => void}) => {
  const { userProfileState, userWithdrawal } = useGlobalContext();
  const [amount, setAmount] = useState<number>(0);

  const closeModal = (event: any) => {
    if(event.target.classList.contains('fixed')) {
      close();
    }
  }

  const withdraw = () => {
    userWithdrawal(amount);
  }
  
  return (
    <div onClick={closeModal} className="fixed flex px-3 w-full h-full justify-center items-center top-0 left-0 bg-secondary bg-opacity-20">
      <div className="bg-white w-full h-fit p-5 md:w-[500px]">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-semibold">Withdraw</p>
          <button className="text-2xl font-semibold" onClick={close}>
            <CgClose />
          </button>
        </div>
        <div className="py-5">
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full py-2 px-3 border-secondary border rounded-md"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />
          <div className="w-full flex  justify-end px-3 py-2">
            <p className="text-xs text-secondary text-opacity-20 font-[500]">
              Withdrawable amount: 
              {userProfileState && userProfileState.balance !== undefined && userProfileState.investments 
                ? parseInt(userProfileState?.balance) - userProfileState.investments.reduce((amount, investment) => amount + investment.amount, 0) 
                : 0}
            </p>
          </div>
          <button
            onClick={withdraw}
            disabled={amount < 10 || amount > parseInt(userProfileState?.balance || "0")}
            className="flex disabled:bg-opacity-10 justify-center w-full rounded-md bg-secondary py-2 text-white text-lg font-semibold"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  )
}

export default WithrawalModal;