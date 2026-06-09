import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext'
import DoctorContextProvider from './context/DoctorContext'
import AdminContextProvider from './context/AdminContext'
import CrmContextProvider from './context/CrmContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminContextProvider>
      <CrmContextProvider>
        <DoctorContextProvider>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </DoctorContextProvider>
      </CrmContextProvider>
    </AdminContextProvider>
  </BrowserRouter>,
)
