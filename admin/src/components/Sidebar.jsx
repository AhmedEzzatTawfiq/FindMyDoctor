import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { CrmContext } from '../context/CrmContext'
import { ShieldPlus, UsersRound, Home, CalendarCheck, UserPlus, Users, Stethoscope, NotebookTabs, CreditCard } from 'lucide-react'

const Sidebar = () => {
  const { aToken } = useContext(AdminContext)
  const { cToken } = useContext(CrmContext)

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 cursor-pointer px-4 py-3 mx-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-500'
        : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-500'
    }`

  const adminLinks = [
    { to: '/admin-dashboard', icon: <Home className="w-5 h-5 opacity-70" />, label: 'Dashboard' },
    { to: '/appointments', icon: <CalendarCheck className="w-5 h-5 opacity-70" />, label: 'Appointments' },
    { to: '/add-doctor', icon: <UserPlus className="w-5 h-5 opacity-70" />, label: 'Add Doctor' },
    { to: '/doctor-list', icon: <Stethoscope className="w-5 h-5 opacity-70" />, label: 'Doctors List' },
  ]

  const staffLinks = [
    { to: '/', icon: <Home className="w-5 h-5 opacity-70" />, label: 'Overview' },
    { to: '/patients', icon: <Users className="w-5 h-5 opacity-70" />, label: 'Patients' },
    { to: '/sessions', icon: <CalendarCheck className="w-5 h-5 opacity-70" />, label: 'Sessions' },
    { to: '/payments', icon: <CreditCard className="w-5 h-5 opacity-70" />, label: 'Payments' },
    { to: '/notes', icon: <NotebookTabs className="w-5 h-5 opacity-70" />, label: 'Notes' },
  ]

  const links = aToken ? adminLinks : staffLinks

  return (
    <aside className="min-h-screen w-56 bg-white/60 backdrop-blur-lg border-r border-gray-100 shadow-sm hidden md:flex flex-col pt-4 pb-8 shrink-0">
      {/* Role badge */}
      <div className="mx-4 mb-4 px-3 py-2 rounded-xl bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-100">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          {aToken ? (<div className='flex items-center gap-2'><ShieldPlus />Admin Panel</div>) : (<div className='flex items-center gap-2'><UsersRound />Staff Panel</div>)}
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1">
        {links.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} className={linkClass}>
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar