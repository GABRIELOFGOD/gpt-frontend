import { useCallback, useState } from "react";
import { BASEURL } from "../components/context/GlobalContext";

const fetchForgotPassword = async (email: string) => {
  const request = await fetch(`${BASEURL}/user/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const response = await request.json();
  return response;
}

const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchForgotPassword(email);
      setIsLoading(false);
      return response;
    } catch (err) {
      setIsLoading(false);
      setError("Forgot password failed");
      throw err;
    }
  }, []);

  return { forgotPassword, isLoading, error };
};

export default useForgotPassword;