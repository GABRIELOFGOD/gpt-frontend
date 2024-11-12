import { createContext, ReactNode, useContext } from "react";

interface GlobalContextType {
  userWallet: string;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const CreateGlobalContext = ({ children }: Props) => {
  const userWallet: string = "wallet1234567890";
  
  return (
    <GlobalContext.Provider value={{ userWallet }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a CreateGlobalContext");
  }
  return context;
};
