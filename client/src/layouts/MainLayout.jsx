import React from 'react'
import Navbar from '../components/layouts/Navbar'
import Footer from '../components/layouts/Footer'
import ScrollToTop from '../components/ui/ScrollToTop'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

const MainLayout = ({ children }) => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ScrollToTop />
      <Toaster />
      <Navbar />
      <main>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
