import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import App from './App.tsx'

import '@rainbow-me/rainbowkit/styles.css';
import { CreateGlobalContext } from './components/context/GlobalContext.tsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CreateGlobalContext>
      <App />
      <Toaster />
    </CreateGlobalContext>
  </StrictMode>,
)
