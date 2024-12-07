import { useCallback, useState } from "react";
import { BASEURL } from "../components/context/GlobalContext";
import { Withdrawal } from "../utils/data";

const getAllWithdrawals = async () => {
  try {
    const request = await fetch(`${BASEURL}/user/all-withdrawal`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const response = await request.json();

    if (response.error) {
      throw new Error(response.error);
    }
    return response.withdrawals;
  } catch (error) {
    throw error;
  }
};

const useWithdrawal = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWithdrawals = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllWithdrawals();
      setWithdrawals(data);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  }, []);

  return { withdrawals, fetchWithdrawals, loading, error };
}

export default useWithdrawal;