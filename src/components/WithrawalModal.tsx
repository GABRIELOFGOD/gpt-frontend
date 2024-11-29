import { CgClose } from "react-icons/cg";
import { useGlobalContext } from "./context/GlobalContext";
import { useState } from "react";

const WithrawalModal = ({ close }: {close: () => void}) => {
  const { userProfileState, userWithdrawal } = useGlobalContext();
  const [processing, setProcessing] = useState<boolean>(false);
  // const [amount, setAmount] = useState<number>(0);

  const closeModal = (event: any) => {
    if(event.target.classList.contains('fixed')) {
      close();
    }
  }

  const withdraw = () => {
    setProcessing(true);
    userWithdrawal(parseFloat(userProfileState?.balance || "0"));
    setProcessing(false);
    close();
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
          <p>Are you sure you want to process withdrawal?</p>
          <div className="flex">
            <button 
              onClick={withdraw} 
              className="bg-primary text-white px-5 py-2 rounded mt-5"
              disabled={processing}
            >
              {processing ? "Processing..." : "Yes"}
            </button>
            <button onClick={close} className="bg-red-500 text-white px-5 py-2 rounded mt-5 ml-5">No</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WithrawalModal;