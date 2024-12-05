import { useCallback, useState } from "react";
import { BASEURL } from "../components/context/GlobalContext";
import toast from "react-hot-toast";
import { Investment } from "../utils/data";

const runInvestment = async (amount: number, wallet: string) => {
  try {
    const response = await fetch(`${BASEURL}/investment/invest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`
      },
      body: JSON.stringify({ amount, wallet }),
    });
    const res = await response.json();
    //  ("response fromhook", res);
    if (!response.ok) {
      throw new Error('Failed to invest');
    }
    return res;
  } catch (err) {
    throw err;
  }
}

const getInvestments = async () => {
  try {
    const response = await fetch(`${BASEURL}/investment/all-investments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`
      },
    });
    const res = await response.json();

    if (!response.ok) {
      throw new Error('Failed to get investments');
    }
    return res;
  } catch (err) {
    toast.error("Failed to get investments");
    throw err;
  }
}

const useInvestment = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [allUsersInvestments, setAllUsersInvestments] = useState<Investment[]>([]);

  const invest = useCallback(async (amount: number, wallet: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await runInvestment(amount, wallet);
      // setIsLoading(false);
      return response;
    } catch (err) {
      // setIsLoading(false);
      setError("Investment failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const allInvestments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getInvestments();
      setAllUsersInvestments(response.data);
      return response;
    } catch (err) {
      setError("Failed to get investments");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { invest, isLoading, error,  allInvestments, allUsersInvestments };
};

export default useInvestment;