import { Dispatch, SetStateAction, useState } from "react"
import useRegister from "../../hooks/RegisterHook";
import toast from "react-hot-toast";

const Register = ({setScreen}:{setScreen: Dispatch<SetStateAction<string>>}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { referralCode, register, isLoading: registerLoading, error: registerError, inputReferralCode } = useRegister();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.dismiss();
      toast.error('Passwords do not match');
      return;
    }
    const registerResponse = await register({name, email, phone, password, referralCode});
    if(registerResponse && registerResponse.status === "fail") {
      toast.dismiss();
      toast.error(registerResponse.message);
    } else {
      localStorage.setItem("user", JSON.stringify(registerResponse.token));
      window.location.reload();
    }
  }

  if(registerError) {
    console.log(registerError);
    toast.dismiss();
    toast.error(registerError);
  }
  
  return (
    <div className='w-full md:w-fit bg-white p-10 rounded-xl h-fit'>
      <p className="text-4xl font-bold">Register</p>
      <p className='text-sm text-neutral-700'>Register to earn with GPTBOTS</p>
      <form
        className='py-5 flex flex-col gap-5'
        onSubmit={registerLoading ? undefined : handleRegister}
      >
        <input
          type="text"
          className='w-full h-12 rounded-md border-2 border-black outline-none px-3'
          placeholder='Name' 
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="text"
          className='w-full h-12 rounded-md border-2 border-black outline-none px-3'
          placeholder='Phone Number' 
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <input
          type="text"
          className='w-full h-12 rounded-md border-2 border-black outline-none px-3'
          placeholder='Email' 
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className='w-full h-12 rounded-md border-2 border-black outline-none px-3'
          placeholder='Password' 
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="password"
          className='w-full h-12 rounded-md border-2 border-black outline-none px-3'
          placeholder='Confirm Password' 
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <input
          type="text"
          className='w-full h-12 rounded-md border-2 border-black outline-none px-3'
          placeholder='Referral Code (Optional)' 
          value={referralCode}
          onChange={e => inputReferralCode(e.target.value)}
        />
        <div className="flex justify-between text-secondary underline">
          <div className="flex items-center">
            {/* Forgot password? */}
          </div>
          <p className="text-primary cursor-pointer" onClick={() => setScreen('login')}>Login</p>
        </div>
        <button
          className='w-full h-12 bg-secondary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={registerLoading}
        >
          {registerLoading ? 'Loading...' : 'Register'}
        </button>
      </form>
    </div>
  )
}

export default Register