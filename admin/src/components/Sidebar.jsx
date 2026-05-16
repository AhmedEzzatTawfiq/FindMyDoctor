import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    const { aToken } = useContext(AdminContext)
    return (
        <div className='hidden md:inline'>
            {
                <ul className='w-50 border-blue-200 border-r-2 h-screen'>
                    <NavLink to={"/admin-dashboard"} className={({isActive})=>`flex gap-2 cursor-pointer p-3 ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
                        <img src={assets.home_icon} alt="" className='w-4' />
                        <p>Dashboard</p>
                    </NavLink>
                    <NavLink to={"/appointments"} className={({isActive})=>`flex gap-2 cursor-pointer p-3 ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
                        <img src={assets.appointment_icon} alt="" className='w-4' />
                        <p>Appointments</p>
                    </NavLink>
                    <NavLink to={"/add-doctor"} className={({isActive})=>`flex gap-2 cursor-pointer p-3 ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
                        <img src={assets.add_icon} alt="" className='w-4' />
                        <p>Add Doctor</p>
                    </NavLink>
                    <NavLink to={"/doctor-list"} className={({isActive})=>`flex gap-2 cursor-pointer p-3 ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
                        <img src={assets.people_icon} alt="" className='w-4' />
                        <p>Doctor List</p>
                    </NavLink>
                </ul>
            }
        </div>
    )
}

export default Sidebar