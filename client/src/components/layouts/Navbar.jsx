import React, { useState, useContext } from 'react'
import { assets } from '../../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import { BriefcaseMedical } from 'lucide-react';

const ADMIN_URL = import.meta.env.PROD
  ? 'https://find-my-doctor-admin.vercel.app/'
  : 'http://localhost:5174';

const Navbar = () => {

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const { token, userData, logout } = useContext(AppContext)


  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]'>
      <div onClick={() => navigate('/')} className="flex items-center gap-2.5 cursor-pointer select-none">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
          <BriefcaseMedical className='text-white' size={18} />
        </div>
        <h1 className="text-xl font-extrabold text-primary tracking-tight">
          FindMyDoctor
        </h1>
      </div>
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/' className={({ isActive }) => `py-1 ${isActive ? 'text-primary font-semibold border-b-2 border-primary' : ''}`}>
          <li>HOME</li>
        </NavLink>
        <NavLink to='/doctors' className={({ isActive }) => `py-1 ${isActive ? 'text-primary font-semibold border-b-2 border-primary' : ''}`}>
          <li>ALL DOCTORS</li>
        </NavLink>
        <NavLink to='/about' className={({ isActive }) => `py-1 ${isActive ? 'text-primary font-semibold border-b-2 border-primary' : ''}`}>
          <li>ABOUT</li>
        </NavLink>
        <NavLink to='/contact' className={({ isActive }) => `py-1 ${isActive ? 'text-primary font-semibold border-b-2 border-primary' : ''}`}>
          <li>CONTACT</li>
        </NavLink>
        <button onClick={() => window.open(ADMIN_URL, '_blank')} className='border px-5 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-50 transition-all'>Admin Panel</button>
      </ul>



      <div className='flex items-center gap-4 '>
        {
          token && userData
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-9 h-9 object-cover rounded-full border border-gray-200' src={userData.image} alt="User Avatar" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="" />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('/profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                  <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden cursor-pointer' src={assets.menu_icon} alt="" />

        {/* Dropdown Menu */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6 cursor-pointer'>
            <div className="flex items-center gap-2 select-none">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-xs">
                <BriefcaseMedical className='text-white' size={16} />
              </div>
              <h1 className="text-lg font-bold text-primary">
                FindMyDoctor
              </h1>
            </div>
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded full inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded full inline-block'>ALL DOCTORS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded full inline-block'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded full inline-block'>CONTACT</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
