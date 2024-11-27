import { useCallback, useState } from "react";
import { BASEURL } from "../components/context/GlobalContext";

const runClaimRef = async () => {
  try {
    const response = await fetch(`${BASEURL}/investment/claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`
      },
    });
    if (!response.ok) {
      throw new Error('Failed to claim ROI');
    }
    return response.json();
  } catch (err) {
    throw err;
  }
}

const runClaimRoi = async () => {
  try {
    const response = await fetch(`${BASEURL}/investment/claim-roi`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`
      },
    });
    if (!response.ok) {
      throw new Error('Failed to claim ROI');
    }
    return response.json();
  } catch (err) {
    throw err;
  }
}

const useClaim = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const claimRoi = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await runClaimRoi();
      return response;
    } catch (err) {
      setError("Claim failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const claimRef = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await runClaimRef();
      return response;
    } catch (err) {
      setError("Claim failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { claimRoi, claimRef, isLoading, error };
}

export default useClaim;