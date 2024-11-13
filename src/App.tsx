import './App.css';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { RouterProvider } from 'react-router-dom';
import { Config, WagmiProvider } from 'wagmi';
import {
  bscTestnet
} from 'wagmi/chains';
import route from './utils/route';


function App() {

  const queryClient = new QueryClient();

  const config: Config = getDefaultConfig({
    appName: "Gpt bot",
    projectId: "gpt-bot",
    chains: [bscTestnet],
  });

  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <RouterProvider router={route} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  )
}

export default App
