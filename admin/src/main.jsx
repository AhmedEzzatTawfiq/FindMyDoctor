import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext'
import DoctorContextProvider from './context/DoctorContext'
import AdminContextProvider from './context/AdminContext'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AdminContextProvider>
        <DoctorContextProvider>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </DoctorContextProvider>
      </AdminContextProvider>
    </QueryClientProvider>
  </BrowserRouter>,
)
