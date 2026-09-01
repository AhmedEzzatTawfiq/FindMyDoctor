import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </QueryClientProvider>
  </BrowserRouter>,
)

