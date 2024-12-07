import { useLocation } from "react-router-dom";
import { RegisterData } from "../utils/data";
import { useCallback, useEffect, useState } from "react";
import { BASEURL } from "../components/context/GlobalContext";

// const fetchRegister = async (data: RegisterData) => {
  
//   const response = await fetch(`${BASEURL}/user/register`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to register');
//   }

//   return response.json();
// }

const fetchRegister = async (data: RegisterData) => {
  //  ("data", data);
  const request = await fetch(`${BASEURL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response = await request.json();
  return response;
}

const confirmWallet = async (wallet: string) => {
  const request = await fetch(`${BASEURL}/user/wallet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ wallet }),
  });
  const response = await request.json();
  // if(!request.ok) {
  //   console.log("response", response);
  //   throw new Error('Failed to confirm wallet');
  // }
  return response;
}

const useRegister = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ref = queryParams.get('ref');

  useEffect(() => {
    setReferralCode(ref ? ref : '');
  }, [ref]);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchRegister(data);
      setIsLoading(false);
      return response;
    } catch (err) {
      setIsLoading(false);
      setError("Registration failed");
      throw err;
    }
  }, []);

  const checkWallet = useCallback(async (wallet: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await confirmWallet(wallet);
      setIsLoading(false);
      return response;
    } catch (err) {
      setIsLoading(false);
      setError("Wallet confirmation failed");
      throw err;
    }
  }, []);

  const inputReferralCode = useCallback((code: string) => {
    setReferralCode(code);
  }
  , []);

  return { register, isLoading, error, referralCode, inputReferralCode, checkWallet };
};

export default useRegister;