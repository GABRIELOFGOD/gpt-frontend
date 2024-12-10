import { Dispatch, FormEvent, SetStateAction, useState } from "react"
import useRegister from "../../hooks/RegisterHook";
import toast from "react-hot-toast";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

const Register = ({setScreen}:{setScreen: Dispatch<SetStateAction<string>>}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { isConnected, address } = useAccount();
  const { connect } = useConnect();

  const { referralCode, register, isLoading: registerLoading, error: registerError, inputReferralCode, checkWallet } = useRegister();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.dismiss();
      toast.error('Passwords do not match');
      return;
    }
    toast.loading('connecting...');
    const wallet = address as string;

    const walletResponse = await checkWallet(wallet);
    if(!walletResponse.message || walletResponse.message !== "Wallet address not found") {
      toast.dismiss();
      toast.error("The connected wallet is registered before, kindly login");
      return;
    }
    
    const registerResponse = await register({name, email, phone, password, wallet, referralCode});
    if(registerResponse && registerResponse.status === "fail") {
      toast.dismiss();
      toast.error(registerResponse.message);
    } else {
      localStorage.setItem("user", JSON.stringify(registerResponse.token));
      window.location.reload();
    }
  }

  if(registerError) {
     (registerError);
    toast.dismiss();
    toast.error(registerError);
  }

  const connectWallet = (e: FormEvent) => {
    e.preventDefault();
    connect({ connector: injected() })
  }
  
  return (
    <div className='w-full md:w-fit bg-white p-10 rounded-xl h-fit'>
      <p className="text-4xl font-bold">Register</p>
      <p className='text-sm text-neutral-700'>Register to earn with GPTBOTS</p>
      <form
        className='py-5 flex flex-col gap-5 formal'
        onSubmit={registerLoading ? undefined : isConnected ? handleRegister : connectWallet}
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
        {isConnected ? <small className="text-[8px] text-green-500" >
          wallet connected
        </small> : <small className="text-[8px] text-red-500 flex gap-2" >
          <span>Wallet not connected, make sure you have web3 wallet activated</span>
          <span
            className="underline cursor-pointer"
            onClick={connectWallet}
          >
            Connect wallet
          </span>
        </small>}
        <button
          className='w-full h-12 bg-secondary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={registerLoading || !name || !phone || !email || !password || !confirmPassword}
        >
          {registerLoading ? 'Loading...' :  'Register'}
        </button>
      </form>
    </div>
  )
}

export default Register