import { Dispatch, SetStateAction, useState } from 'react'
import useLogin from '../../hooks/LoginHook';
import toast from 'react-hot-toast';

const Login = ({setScreen}:{setScreen: Dispatch<SetStateAction<string>>}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoading: loginLoading, error: loginError } = useLogin();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginResponse = await login(email, password);
    if(loginResponse && loginResponse.status === "fail") {
      toast.error(loginResponse.message);
    } else {
      localStorage.setItem("user", JSON.stringify(loginResponse.token));
      window.location.reload();
    }
     (loginResponse);
  }

  if(loginError) {
    toast.error(loginError);
  }
  
  return (
    <div className='w-full md:w-fit bg-white p-10 rounded-xl h-fit'>
      <p className="text-4xl font-bold">Login</p>
      <p className='text-sm text-neutral-700'>Login to earn with GPTBOTS</p>
      <form
        className='py-5 flex flex-col gap-5 formal'
        onSubmit={loginLoading ? undefined : handleLogin}
      >
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
        <div className="flex justify-between text-secondary underline">
          <div className="flex items-center cursor-pointer " onClick={()=>setScreen("forgot-password")}>
            Forgot password?
          </div>
          <p className="text-primary cursor-pointer" onClick={() => setScreen('register')}>Register</p>
        </div>
        <button
          className='w-full h-12 bg-secondary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={loginLoading}
        >
          {loginLoading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Login