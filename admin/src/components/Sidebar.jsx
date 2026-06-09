import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { CrmContext } from '../context/CrmContext'
import { ShieldPlus, UsersRound } from 'lucide-react'

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
    { to: '/admin-dashboard', icon: assets.home_icon, label: 'Dashboard' },
    { to: '/appointments', icon: assets.appointment_icon, label: 'Appointments' },
    { to: '/add-doctor', icon: assets.add_icon, label: 'Add Doctor' },
    { to: '/doctor-list', icon: assets.people_icon, label: 'Doctors List' },
  ]

  const staffLinks = [
    { to: '/', icon: assets.home_icon, label: 'Overview' },
    { to: '/patients', icon: assets.patients_icon, label: 'Patients' },
    { to: '/sessions', icon: assets.appointment_icon, label: 'Sessions' },
    { to: '/payments', icon: assets.earning_icon || assets.appointments_icon, label: 'Payments' },
    { to: '/notes', icon: assets.list_icon, label: 'Notes' },
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
            <img src={icon} alt="" className="w-4 h-4 opacity-70" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar