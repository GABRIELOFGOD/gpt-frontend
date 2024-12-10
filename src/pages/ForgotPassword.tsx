import { Dispatch, SetStateAction, useState } from "react";
import useForgotPassword from "../hooks/useForgotPassword";
import toast from "react-hot-toast";

const ForgotPassword = ({setScreen}:{setScreen: Dispatch<SetStateAction<string>>}) => {
  const [email, setEmail] = useState('');
  
  const { forgotPassword, isLoading: loginLoading, error: loginError } = useForgotPassword();

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const forgotPasswordResponse = await forgotPassword(email);
    if(forgotPasswordResponse && forgotPasswordResponse.status === "fail" || forgotPasswordResponse.status === "error") {
      toast.error(forgotPasswordResponse.message);
    } else {
      toast.success(forgotPasswordResponse.message);
      setScreen('login');
    }
  }

  if (loginError) {
    toast.error(loginError);
  }
  
  return (
    <div className='w-full md:w-fit bg-white p-10 rounded-xl h-fit'>
      <p className="text-4xl font-bold">Forgot Password</p>
      <p className='text-sm text-neutral-700'>Input your email address for a reset link</p>
      <form
        className='py-5 flex flex-col gap-5 formal'
        onSubmit={loginLoading ? undefined : handleForgotPassword}
      >
        <input
          type="text"
          className='w-full h-12 rounded-md border-2 border-black outline-none px-3'
          placeholder='Email' 
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <div className="flex justify-between text-secondary underline">
          {/* <div className="flex items-center">
            Forgot password?
          </div> */}
          <p className="text-primary cursor-pointer" onClick={() => setScreen('login')}>Back to login</p>
        </div>
        <button
          className='w-full h-12 bg-secondary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={loginLoading}
        >
          {loginLoading ? 'Loading...' : 'Send email'}
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword