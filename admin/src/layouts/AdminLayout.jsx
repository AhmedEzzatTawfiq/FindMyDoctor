import React from 'react'
import Navbar from '../components/layouts/Navbar'
import Sidebar from '../components/layouts/Sidebar'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AdminLayout = ({ children }) => {
  return (
    <div className='bg-[#F8F9FD] min-h-screen'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <main className='flex-1'>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
