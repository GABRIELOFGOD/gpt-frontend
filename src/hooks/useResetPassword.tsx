import { useState } from "react";
import { BASEURL } from "../components/context/GlobalContext";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const sendResetPassword = async (password: string, token: string) => {
  const request = await fetch(`${BASEURL}/user/reset-password?token=${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
  const response = await request.json();
  // if (!request.ok) {
  //   throw new Error("Failed to reset password");
  // }
  return response;
}

const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  if (!token) {
    toast.error("Invalid reset password link");
  }

  const resetPassword = async (password: string) => {
    setIsLoading(true);
    try {
      const response = await sendResetPassword(password, token!);
      return response;
    } catch (error: any) {
      console.log("error", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, resetPassword };
}

export default useResetPassword;