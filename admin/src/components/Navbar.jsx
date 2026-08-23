import React, { useContext, useState, useRef, useEffect } from 'react'
import { AdminContext } from '../context/AdminContext'
import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import { BriefcaseMedical, Home, CalendarCheck, UserPlus, Stethoscope, LogOut, ChevronDown } from 'lucide-react'

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const logout = () => {
    setAToken('')
    localStorage.removeItem('aToken')
    sessionStorage.clear()
    setMobileMenuOpen(false)
    navigate('/')
  }

  // Close when route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { to: '/admin-dashboard', icon: <Home className="w-4 h-4" />, label: 'Dashboard' },
    { to: '/appointments', icon: <CalendarCheck className="w-4 h-4" />, label: 'Appointments' },
    { to: '/add-doctor', icon: <UserPlus className="w-4 h-4" />, label: 'Add Doctor' },
    { to: '/doctor-list', icon: <Stethoscope className="w-4 h-4" />, label: 'Doctors List' },
  ]

  const currentLink = navLinks.find(l => l.to === location.pathname) || navLinks[0]

  return (
    <header ref={menuRef} className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-xs sticky top-0 z-30">
      <div className="flex justify-between items-center px-4 sm:px-8 py-3">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xs">
            <BriefcaseMedical className='text-white w-4 h-4' />
          </div>
          <h1 className="text-lg font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            FindMyDoctor
          </h1>
          {aToken && (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Admin
            </span>
          )}
        </div>

        {aToken && (
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={logout}
              className="bg-linear-to-r from-indigo-500 to-purple-600 text-white text-xs px-4 py-2 rounded-full font-semibold hover:shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        )}

        {aToken && (
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {currentLink.icon}
              <span className="max-w-27.5 truncate">{currentLink.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {aToken && mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
            Navigation Menu
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ to, icon, label }) => {
              const isActive = location.pathname === to
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {icon}
                    <span>{label}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs py-2.5 rounded-xl font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Account</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar