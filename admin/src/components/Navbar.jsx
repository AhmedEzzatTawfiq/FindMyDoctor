import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { BriefcaseMedical } from 'lucide-react'

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext)
  const navigate = useNavigate()

  const logout = () => {
    setAToken('')
    localStorage.removeItem('aToken')
    navigate('/')
  }

  return (
    <div className="flex justify-between items-center px-4 sm:px-8 py-3 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-20">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <BriefcaseMedical className='text-white w-4 h-4' />
        </div>
        <h1 className="text-lg font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          FindMyDoctor
        </h1>
        {aToken && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
            Admin
          </span>
        )}
      </div>

      {/* Logout */}
      {aToken && (
        <button
          onClick={logout}
          className="bg-linear-to-r from-indigo-500 to-purple-600 text-white text-sm px-5 py-2 rounded-full font-semibold hover:shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
        >
          Logout
        </button>
      )}
    </div>
  )
}

export default Navbar