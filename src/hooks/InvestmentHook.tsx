import { useCallback, useState } from "react";
import { BASEURL } from "../components/context/GlobalContext";

const runInvestment = async (amount: number) => {
  try {
    const response = await fetch(`${BASEURL}/investment/invest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('user')}`
      },
      body: JSON.stringify({ amount })
    });
    if (!response.ok) {
      throw new Error('Failed to invest');
    }
    return response.json();
  } catch (err) {
    throw err;
  }
}

const useInvestment = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const invest = useCallback(async (amount: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await runInvestment(amount);
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

  return { invest, isLoading, error };
};

export default useInvestment;