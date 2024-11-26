import { useState, useCallback } from "react";
import { BASEURL } from "../components/context/GlobalContext";

const fecthLogin = async (email: string, password: string) => {  
  const request = await fetch(`${BASEURL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const response = await request.json();
  return response;
}
// import { useCallback } from "react";

const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fecthLogin(email, password);
      setIsLoading(false);
      return response;
    } catch (err) {
      setIsLoading(false);
      setError("Login failed");
      throw err;
    }
  }, []);

  return { login, isLoading, error };
};

export default useLogin;