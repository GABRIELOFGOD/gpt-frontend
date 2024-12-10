import { useCallback, useState } from "react";
import { BASEURL } from "../components/context/GlobalContext";
import { Downlines } from "../utils/data";

const getDownline = async () => {
  const request = await fetch(`${BASEURL}/user/downlines`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`
    },
  });
  const response = await request.json();
  console.log("Response from hook", response);
  if (!request.ok) {
    throw new Error("Failed to fetch downline");
  }
  return response.data;
}

const useDownline = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [downline, setDownline] = useState<Downlines[]>([]);

  const userDownline = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getDownline();
      setDownline(response);
      setIsLoading(false);
      return response;
    } catch (err) {
      setIsLoading(false);
      setError("Login failed");
      throw err;
    }
  }, []);

  return { isLoading, error, downline, userDownline }
}

export default useDownline