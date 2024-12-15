import { useState } from "react";
import { MdOutlineSwapVert } from "react-icons/md";
import { useGlobalContext } from "../components/context/GlobalContext";
import { SwapData, Token } from "../utils/data";
import useEarning from "../hooks/userHook";
import toast from "react-hot-toast";

// Token configuration
const TOKENS: Token[] = [
  {
    name: "USDT",
    image: "/static/2.png",
    rate: 1,
  },
  {
    name: "GPTCOIN",
    image: "/static/3.png",
    rate: 0.004,
  },
];

const Swap = () => {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);

  const [amountFrom, setAmountFrom] = useState<number>(0);
  const [amountTo, setAmountTo] = useState<number>(0);

  const { userProfileState, userProfile } = useGlobalContext();
  const { userSwaps, isLoading, error } = useEarning();

  if (error) {
     (error);
    toast.error(error);
  }

  // Conversion logic
  const converter = (amount: number, direction: "from" | "to") => {
    if (!fromToken || !toToken) return;

    if (direction === "from") {
      const converted = amount * (fromToken.rate / toToken.rate);
      setAmountTo(Number(converted.toFixed(6)));
    } else {
      const converted = amount * (toToken.rate / fromToken.rate);
      setAmountFrom(Number(converted.toFixed(6)));
    }
  };

  // Handle token swapping
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setAmountFrom(amountTo);
    setAmountTo(amountFrom);
  };

  // Utility for getting balance
  const getBalance = (tokenName: string) => {
    return tokenName === "USDT"
      ? userProfileState?.balance
      : userProfileState?.gptBalance;
  };

  const swapToken = async () => {
    if (!fromToken || !toToken || fromToken.name === toToken.name || isLoading)
      return;

    const data: SwapData = {
      amount: amountFrom,
      to: toToken.name === "USDT" ? "USDT" : "GPT",
    };

    try {
      const swapResponse = await userSwaps(data);
       (swapResponse);
      if (swapResponse.status && swapResponse.status === "fail") {
        toast.error(swapResponse.message);
        return;
      }
      toast.success("Swap successful");
      userProfile();
      setAmountFrom(0);
      setAmountTo(0);
      setFromToken(TOKENS[0]);
      setToToken(TOKENS[1]);
    } catch (err) {
       (err);
      toast.error("Swap failed");
    }
  };

  return (
    <div className="px-3 md:px-52 flex flex-col items-center justify-center h-[90vh] py-10 md:py-20">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-screen -z-20">
        <img
          src="/images/bg.avif"
          className="h-full w-full"
          alt="background image"
        />
      </div>

      {/* Swap Container */}
      <div className="px-5 py-10 rounded-lg bg-white w-full h-fit">
        <div className="flex gap-2">
          <img src="/icons/GPT SWAP.gif" alt="Loader" className="w-[50px]" />
          <h1 className="font-bold text-2xl md:text-4xl my-auto">GPT Swap</h1>
        </div>
        <p className="font-semibold md:text-2xl text-neutral-500">
          Convert your USDT to GPTCOIN
        </p>

        <div className="py-5 flex flex-col gap-5">
          {/* From Section */}
          <TokenInput
            label="From"
            token={fromToken}
            tokens={TOKENS}
            balance={fromToken ? getBalance(fromToken.name) : undefined}
            amount={amountFrom}
            onTokenChange={(selectedToken) => {
              setFromToken(selectedToken);
              setAmountFrom(0);
              setAmountTo(0);
            }}
            onAmountChange={(amount) => {
              setAmountFrom(amount);
              converter(amount, "from");
            }}
            onMaxClick={() => {
              const maxBalance = Number(getBalance(fromToken?.name || "") || 0);
              setAmountFrom(maxBalance);
              converter(maxBalance, "from");
            }}
          />

          {/* Swap Button */}
          <div className="w-full flex justify-center">
            <button
              className="w-fit h-fit bg-neutral-200 rounded-full p-2"
              onClick={handleSwapTokens}
              disabled={!fromToken || !toToken}
            >
              <MdOutlineSwapVert color="#000000" size={30} />
            </button>
          </div>

          {/* To Section */}
          <TokenInput
            label="To"
            token={toToken}
            tokens={TOKENS}
            balance={toToken ? getBalance(toToken.name) : undefined}
            amount={amountTo}
            onTokenChange={(selectedToken) => {
              setToToken(selectedToken);
              setAmountFrom(0);
              setAmountTo(0);
            }}
            onAmountChange={(amount) => {
              setAmountTo(amount);
              converter(amount, "to");
            }}
            onMaxClick={() => {
              const maxBalance = Number(getBalance(toToken?.name || "") || 0);
              setAmountTo(maxBalance);
              converter(maxBalance, "to");
            }}
          />
        </div>

        {/* Swap Action */}
        <button
          disabled={
            !fromToken ||
            !toToken ||
            fromToken.name === toToken.name ||
            isLoading
          }
          className={` text-white py-4 font-semibold mt-10 justify-self-end rounded-md w-full ${
            !fromToken ||
            !toToken ||
            fromToken.name === toToken.name ||
            isLoading
              ? "cursor-not-allowed bg-neutral-400"
              : "cursor-pointer bg-secondary"
          }`}
          onClick={swapToken}
        >
          {isLoading ? "Swapping..." : "Swap"}
        </button>
      </div>
    </div>
  );
};

// TokenInput Component
interface TokenInputProps {
  label: string;
  token: Token | null;
  tokens: Token[];
  balance?: string;
  amount: number;
  onTokenChange: (token: Token | null) => void;
  onAmountChange: (amount: number) => void;
  onMaxClick: () => void; // For Max functionality
}

const TokenInput = ({
  label,
  token,
  tokens,
  balance,
  amount,
  onTokenChange,
  onAmountChange,
  onMaxClick,
}: TokenInputProps) => {
  return (
    <div>
      <div className="flex justify-between">
        <label htmlFor={label.toLowerCase()} className="text-neutral-500 pb-2">
          {label}
        </label>
        {balance && (
          <p className="text-xs flex my-auto text-neutral-600">
            Bal: <span className="text-neutral-400"> {balance}</span>
          </p>
        )}
      </div>
      <div className="bg-neutral-200 w-full flex h-16 rounded-md py-2 px-3">
        <div className="px-3 h-full bg-white w-fit flex gap-1 rounded-md">
          {token?.image && (
            <div className="w-[30px] py-2 my-auto">
              <img src={token.image} className="w-full" alt={`${label} token`} />
            </div>
          )}
          <select
            name={label.toLowerCase()}
            id={label.toLowerCase()}
            className="w-fit h-full bg-transparent rounded-md font-semibold outline-none"
            onChange={(e) =>
              onTokenChange(tokens.find((t) => t.name === e.target.value) || null)
            }
            value={token?.name || ""}
          >
            <option value="">Select Token</option>
            {tokens.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <input
          type="number"
          placeholder={label.toUpperCase()}
          className="w-full text-right h-full bg-transparent outline-none"
          onChange={(e) => onAmountChange(Number(e.target.value))}
          value={amount}
        />
      </div>
      <div className="w-full flex justify-end">
        <button onClick={onMaxClick} className="text-primary-500 font-semibold">
          Max
        </button>
      </div>
    </div>
  );
};

export default Swap;


// import { useState } from "react";
// import { MdOutlineSwapVert } from "react-icons/md";
// import { useGlobalContext } from "../components/context/GlobalContext";
// import { SwapData, Token } from "../utils/data";
// import useEarning from "../hooks/userHook";
// import toast from "react-hot-toast";

// // Token configuration
// const TOKENS: Token[] = [
//   {
//     name: "USDT",
//     image: "/static/2.png",
//     rate: 1,
//   },
//   {
//     name: "GPTCOIN",
//     image: "/static/3.png",
//     rate: 0.004,
//   },
// ];

// const Swap = () => {
//   const [fromToken, setFromToken] = useState<Token | null>(null);
//   const [toToken, setToToken] = useState<Token | null>(null);

//   const [amountFrom, setAmountFrom] = useState<number>(0);
//   const [amountTo, setAmountTo] = useState<number>(0);

//   const { userProfileState, userProfile } = useGlobalContext();
//   const { userSwaps, isLoading, error } = useEarning();

//   if (error) {
//      (error);
//     toast.error(error);
//   }

//   // Conversion logic
//   const converter = (amount: number, direction: "from" | "to") => {
//     if (!fromToken || !toToken) return;

//     if (direction === "from") {
//       const converted = amount * (fromToken.rate / toToken.rate);
//       setAmountTo(Number(converted.toFixed(6)));
//     } else {
//       const converted = amount * (toToken.rate / fromToken.rate);
//       setAmountFrom(Number(converted.toFixed(6)));
//     }
//   };

//   // Handle token swapping
//   const handleSwapTokens = () => {
//     const temp = fromToken;
//     setFromToken(toToken);
//     setToToken(temp);
//     setAmountFrom(amountTo);
//     setAmountTo(amountFrom);
//   };

//   // Utility for getting balance
//   const getBalance = (tokenName: string) => {
//     return tokenName === "USDT"
//       ? userProfileState?.balance
//       : userProfileState?.gptBalance;
//   };

//   const swapToken = async () => {
//     if (!fromToken || !toToken || fromToken.name === toToken.name || isLoading) return;

//     const data: SwapData = {
//       amount: amountFrom,
//       to: toToken.name == "USDT" ? "USDT" : "GPT",
//     };

//     try {
//       const swapResponse = await userSwaps(data);
//       if(swapResponse.status && swapResponse.status === "fail") {
//         toast.error(swapResponse.message);
//         return;
//       }
//       toast.success("Swap successful");
//       userProfile();
//       setAmountFrom(0);
//       setAmountTo(0);
//       setFromToken(TOKENS[0]);
//       setToToken(TOKENS[1]);
//     } catch (err) {
//        (err);
//       toast.error("Swap failed");
//     }
//   };

//   return (
//     <div className="px-3 md:px-52 flex flex-col items-center justify-center h-[90vh] py-10 md:py-20">
//       {/* Background */}
//       <div className="fixed top-0 left-0 w-full h-screen -z-20">
//         <img
//           src="/images/bg.avif"
//           className="h-full w-full"
//           alt="background image"
//         />
//       </div>

//       {/* Swap Container */}
//       <div className="px-5 py-10 rounded-lg bg-white w-full h-fit">
//         <h1 className="font-bold text-2xl md:text-4xl">Swap</h1>
//         <p className="font-semibold md:text-2xl text-neutral-500">
//           Convert your USDT to GPTCOIN
//         </p>

//         <div className="py-5 flex flex-col gap-5">
//           {/* From Section */}
//           <TokenInput
//             label="From"
//             token={fromToken}
//             tokens={TOKENS}
//             balance={fromToken ? getBalance(fromToken.name) : undefined}
//             amount={amountFrom}
//             onTokenChange={(selectedToken) => {
//               setFromToken(selectedToken);
//               setAmountFrom(0);
//               setAmountTo(0);
//             }}
//             onAmountChange={(amount) => {
//               setAmountFrom(amount);
//               converter(amount, "from");
//             }}
//           />

//           {/* Swap Button */}
//           <div className="w-full flex justify-center">
//             <button
//               className="w-fit h-fit bg-neutral-200 rounded-full p-2"
//               onClick={handleSwapTokens}
//               disabled={!fromToken || !toToken}
//             >
//               <MdOutlineSwapVert color="#000000" size={30} />
//             </button>
//           </div>

//           {/* To Section */}
//           <TokenInput
//             label="To"
//             token={toToken}
//             tokens={TOKENS}
//             balance={toToken ? getBalance(toToken.name) : undefined}
//             amount={amountTo}
//             onTokenChange={(selectedToken) => {
//               setToToken(selectedToken);
//               setAmountFrom(0);
//               setAmountTo(0);
//             }}
//             onAmountChange={(amount) => {
//               setAmountTo(amount);
//               converter(amount, "to");
//             }}
//           />
//         </div>

//         {/* Swap Action */}
//         <button
//           disabled={!fromToken || !toToken || fromToken.name === toToken.name || isLoading}
//           className={`bg-primary-500 text-white py-4 font-semibold mt-10 justify-self-end rounded-md w-full bg-secondary ${
//             !fromToken || !toToken || fromToken.name === toToken.name || isLoading
//               ? "cursor-not-allowed bg-neutral-400"
//               : "cursor-pointer"
//           }`}
//           onClick={swapToken}
//         >
//           {isLoading ? "Swapping..." : "Swap"}
//         </button>
//       </div>
//     </div>
//   );
// };

// // TokenInput Component
// interface TokenInputProps {
//   label: string;
//   token: Token | null;
//   tokens: Token[];
//   balance?: string;
//   amount: number;
//   onTokenChange: (token: Token | null) => void;
//   onAmountChange: (amount: number) => void;
// }

// const TokenInput = ({
//   label,
//   token,
//   tokens,
//   balance,
//   amount,
//   onTokenChange,
//   onAmountChange,
// }: TokenInputProps) => {
//   return (
//     <div>
//       <div className="flex justify-between">
//         <label htmlFor={label.toLowerCase()} className="text-neutral-500 pb-2">
//           {label}
//         </label>
//         {balance && (
//           <p className="text-xs flex my-auto text-neutral-600">
//             Bal: <span className="text-neutral-400"> {balance}</span>
//           </p>
//         )}
//       </div>
//       <div className="bg-neutral-200 w-full flex h-16 rounded-md py-2 px-3">
//         <div className="px-3 h-full bg-white w-fit flex gap-1 rounded-md">
//           {token?.image && (
//             <div className="w-[30px] py-2 my-auto">
//               <img src={token.image} className="w-full" alt={`${label} token`} />
//             </div>
//           )}
//           <select
//             name={label.toLowerCase()}
//             id={label.toLowerCase()}
//             className="w-fit h-full bg-transparent rounded-md font-semibold outline-none"
//             onChange={(e) =>
//               onTokenChange(tokens.find((t) => t.name === e.target.value) || null)
//             }
//             value={token?.name || ""}
//           >
//             <option value="">Select Token</option>
//             {tokens.map((t) => (
//               <option key={t.name} value={t.name}>
//                 {t.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <input
//           type="number"
//           placeholder={label.toUpperCase()}
//           className="w-full text-right h-full bg-transparent outline-none"
//           onChange={(e) => onAmountChange(Number(e.target.value))}
//           value={amount}
//         />
//       </div>
//       <div className="w-full flex justify-end">
//         <button>Max</button>
//       </div>
//     </div>
//   );
// };

// export default Swap;

