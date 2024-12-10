import { useState } from "react"
import useResetPassword from "../hooks/useResetPassword"
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState('')

  const { resetPassword, isLoading: loginLoading, error: loginError } = useResetPassword();

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resetPasswordResponse = await resetPassword(password);
    if(resetPasswordResponse && resetPasswordResponse.status === "fail" || resetPasswordResponse.status === "error") {
      toast.error(resetPasswordResponse.message);
    } else {
      toast.success(resetPasswordResponse.message);
      location.assign("/investments");
    }
  }

  if (loginError) {
    toast.error(loginError);
  }
  
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="fixed top-0 left-0 w-full h-screen -z-20">
        <img src="/images/bg.avif" className="h-full w-full" alt="background image" />
      </div>
      <div className='w-full md:w-fit bg-white p-10 rounded-xl h-fit'>
        <p className="text-4xl font-bold">Reset Password</p>
        <p className='text-sm text-neutral-700'>Enter new password</p>
        <form
          className='py-5 flex flex-col gap-5 formal'
          onSubmit={loginLoading ? undefined : handleResetPassword}
        >
          <input
            type="password"
            className='w-full h-12 rounded-md border-2 border-black outline-none px-3'
            placeholder='Password' 
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            className='w-full h-12 bg-secondary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={loginLoading}
          >
            {loginLoading ? 'Loading...' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword