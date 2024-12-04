import { useState, useCallback } from "react";
import { BASEURL } from "../components/context/GlobalContext";
import { EarningHistory, SwapData } from "../utils/data";

const getUserEarnings = async () => {
  const request = await fetch(`${BASEURL}/user/history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`
    },
  });
  const response = await request.json();
   (response.history);
  return response.history;
}

const swapCall = async (data: SwapData) => {
  const request = await fetch(`${BASEURL}/user/swap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`
    },
    body: JSON.stringify(data)
  });
  const response = await request.json();
  return response;
}

const useEarning = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [earnings, setEarnings] = useState<EarningHistory[]>([]);

  const userEarnings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUserEarnings();
      setEarnings(response.earnings);
      setIsLoading(false);
      return response;
    } catch (err) {
      setIsLoading(false);
      setError("Login failed");
      throw err;
    }
  }, []);

  const userSwaps = useCallback(async (data: SwapData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await swapCall(data);
      setIsLoading(false);
      return response;
    } catch (err) {
      setIsLoading(false);
      setError("Swap failed");
      throw err;
    }
  }, []);

  const getCummulativeROI = (): number => {
    return earnings
      .filter(earning => earning.generationLevel === 0)
      .reduce((total, earning) => total + parseFloat(earning.amountEarned), 0);
  }

  const getCummulativeReferral = (): number => {
    return earnings
      .filter(earning => earning.generationLevel > 0)
      .reduce((total, earning) => total + parseFloat(earning.amountEarned), 0);
  }

  return { userEarnings, isLoading, error, earnings, getCummulativeROI, getCummulativeReferral, userSwaps };
};

export default useEarning;