import { createContext, ReactNode, useContext } from "react";

interface GlobalContextType {
  userWallet: string;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const CreateGlobalContext = ({ children }: Props) => {
  const userWallet: string = "0x7b49660dc6F25326d2fA7C3CD67970dF73eB5Ec1";

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
