import { useState } from "react";
import { BASEURL } from "../components/context/GlobalContext";
import toast from "react-hot-toast";

const getCoinPrice = async () => {
  try {
    const request = await fetch(`${BASEURL}/coin/get`);
    const response = await request.json();

    if (!request.ok) {
      throw new Error(response.message);
    }
    return response.price;
  } catch (error) {
    throw error;
  }
};

const useCoin = () => {
  const [coinPrice, setCoinPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCoinPrice = async () => {
    setLoading(true);
    try {
      const price = await getCoinPrice();
      setCoinPrice(price.price);
      // console.log(price.price);
      return price.price;
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleCoinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCoinPrice(Number(event.target.value));
  };

  const updateCoinPrice = async () => {
    setLoading(true);
    try {
      const request = await fetch(`${BASEURL}/coin/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user") as string)}`,
        },
        body: JSON.stringify({ price: coinPrice }),
      });
      const response = await request.json();

      if (!request.ok) {
        throw new Error(response.message);
      }
      toast.success("Coin price updated successfully");
      setCoinPrice(coinPrice);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return { coinPrice, fetchCoinPrice, loading, error, handleCoinPriceChange, updateCoinPrice };
};

export default useCoin;