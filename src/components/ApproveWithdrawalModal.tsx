import { CgClose } from "react-icons/cg"

const ApproveWithdrawalModal = ({closeModal}:{closeModal: () => void}) => {
  return (
    <div onClick={closeModal} className="fixed flex px-3 w-full h-full justify-center items-center top-0 left-0 bg-secondary bg-opacity-20">
      <div className="bg-white w-full h-fit p-5 md:w-[500px]">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-semibold">Approve Withdrawal</p>
          <button className="text-2xl font-semibold" onClick={closeModal}>
            <CgClose />
          </button>
        </div>
        <div className="py-5">
          <p>Are you sure you want to approve this withdrawal?</p>
          <div className="flex">
            <button 
              onClick={() => {}} 
              className="bg-primary text-white px-5 py-2 rounded mt-5"
            >
              Yes
            </button>
            <button onClick={closeModal} className="bg-red-500 text-white px-5 py-2 rounded mt-5 ml-5">No</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApproveWithdrawalModal