import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { Config, WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { RouterProvider } from 'react-router-dom';
import route from './utils/route';


function App() {

  const queryClient = new QueryClient();

  const config: Config = getDefaultConfig({
    appName: "Gpt bot",
    projectId: "gpt-bot",
    chains: [mainnet, polygon, optimism, arbitrum, base],
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
